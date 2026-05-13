const {
  lastUpdated,
  dartsPlayers,
  plDartsStandings,
  dartsCalendar,
  officialPlayers = [],
  sourceMeta = {}
} = window.DARTS_DATA;

const STORAGE_KEY = 'darts-planner-state-v1';
const FALLBACK_PLAYER_KEYS = Object.entries(dartsPlayers).map(([key, value]) => ({ key, name: value.name }));
const playerNameMap = Object.fromEntries(FALLBACK_PLAYER_KEYS.map((player) => [player.key, player.name]));
const plannerState = loadPlannerState();
const today = new Date();
today.setHours(0, 0, 0, 0);

const state = {
  query: '',
  series: 'all',
  mode: 'all'
};

function loadPlannerState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      saved: parsed.saved || {},
      boards: parsed.boards || {},
      channels: parsed.channels || {},
      notes: parsed.notes || {}
    };
  } catch {
    return { saved: {}, boards: {}, channels: {}, notes: {} };
  }
}

function persistPlannerState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeEventName(name) {
  return name.replace(' - Finale', '').replace(' - Play-Offs', '').trim();
}

function seriesFor(name) {
  if (name.startsWith('Premier League Darts')) return 'Premier League';
  if (name.includes('World Championship') || name.includes('World Matchplay') || name.includes('Grand Slam') || name.includes('Players Championship Finals') || name.includes('European Championship') || name.includes('World Cup')) return 'TV Major';
  if (name.includes('Players Championship')) return 'Players Championship';
  if (name.includes('European Tour') || name.includes('Open') || name.includes('Trophy') || name.includes('Grand Prix')) return 'Tour Event';
  if (name.includes('Masters')) return 'World Series';
  return 'PDC';
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' });
}

function formatDateLong(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatMoney(value) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value || 0);
}

function formatCountry(code) {
  const map = {
    'NL': 'Nederland',
    'BE': 'Belgie',
    'DE': 'Duitsland',
    'PL': 'Polen',
    'AU': 'Australie',
    'IE': 'Ierland',
    'GB-ENG': 'Engeland',
    'GB-WLS': 'Wales',
    'GB-NIR': 'Noord-Ierland',
    'GB-SCT': 'Schotland'
  };
  return map[code] || code || '';
}

function formatMatchName(match) {
  if (match.label) return match.label;
  const home = playerNameMap[match.home] || match.home || 'TBD';
  const away = playerNameMap[match.away] || match.away || '';
  return away ? `${home} vs ${away}` : home;
}

const parsedEvents = dartsCalendar.map((event, eventIndex) => {
  const eventId = `${slugify(event.event)}-${event.date}-${eventIndex}`;
  const baseEvent = normalizeEventName(event.event);
  const series = seriesFor(event.event);
  const dateObj = new Date(`${event.date}T${event.time || '00:00'}:00`);
  const matches = event.matches.map((match, matchIndex) => {
    const matchId = `${eventId}-match-${matchIndex}`;
    const defaultChannel = event.channel || '';
    return {
      ...match,
      eventId,
      matchId,
      eventTitle: event.event,
      baseEvent,
      series,
      date: event.date,
      eventTime: event.time,
      location: event.location,
      channel: defaultChannel,
      displayName: formatMatchName(match)
    };
  });

  return {
    ...event,
    eventId,
    baseEvent,
    series,
    dateObj,
    matches
  };
}).sort((left, right) => left.dateObj - right.dateObj);

const groupedTournaments = Object.values(parsedEvents.reduce((acc, event) => {
  const key = event.baseEvent;
  if (!acc[key]) {
    acc[key] = {
      title: key,
      location: event.location,
      channel: event.channel,
      series: event.series,
      sessions: []
    };
  }
  acc[key].sessions.push(event);
  return acc;
}, {}));

const flattenedMatches = parsedEvents.flatMap((event) => event.matches);
const upcomingEvents = parsedEvents.filter((event) => event.dateObj >= today);
const nextEvent = upcomingEvents[0] || parsedEvents[parsedEvents.length - 1];
const nextSessions = upcomingEvents.slice(0, 8);
const savedMatches = () => flattenedMatches.filter((match) => plannerState.saved[match.matchId]);

function getBoard(matchId) {
  return plannerState.boards[matchId] || '';
}

function getChannel(match) {
  return plannerState.channels[match.matchId] || match.channel || '';
}

function getNote(matchId) {
  return plannerState.notes[matchId] || '';
}

function matchSearchText(match) {
  return [
    match.displayName,
    match.eventTitle,
    match.baseEvent,
    match.series,
    match.location,
    match.channel,
    getBoard(match.matchId),
    getChannel(match),
    getNote(match.matchId)
  ].join(' ').toLowerCase();
}

function filteredMatches() {
  const query = state.query.trim().toLowerCase();
  return flattenedMatches.filter((match) => {
    if (state.series !== 'all' && match.series !== state.series) return false;
    if (state.mode === 'planned' && !plannerState.saved[match.matchId]) return false;
    if (state.mode === 'customized' && !getBoard(match.matchId) && !plannerState.channels[match.matchId]) return false;
    if (!query) return true;
    return matchSearchText(match).includes(query);
  });
}

function renderHero() {
  document.getElementById('next-event').innerHTML = `
    <div class="result-title">${nextEvent.event}</div>
    <div class="meta">${formatDateLong(nextEvent.date)} · ${nextEvent.time} · ${nextEvent.location}</div>
    <div class="support-copy" style="margin-top: 10px;">${nextEvent.matches.length} schema-item(s) · standaard kanaal ${nextEvent.channel}</div>`;

  const activeChannels = new Set(parsedEvents.map((event) => event.channel).filter(Boolean));
  const customBoards = new Set(Object.values(plannerState.boards).filter(Boolean));

  document.getElementById('stats-grid').innerHTML = `
    <article class="stat-card stagger"><div class="stat-label">Komende sessies</div><div class="stat-value">${upcomingEvents.length}</div></article>
    <article class="stat-card stagger"><div class="stat-label">Toernooien</div><div class="stat-value">${groupedTournaments.length}</div></article>
    <article class="stat-card stagger"><div class="stat-label">Streams / kanalen</div><div class="stat-value">${activeChannels.size}</div></article>
    <article class="stat-card stagger"><div class="stat-label">Eigen boards</div><div class="stat-value">${customBoards.size}</div></article>`;
}

function matchCard(match) {
  const boardValue = escapeHtml(getBoard(match.matchId));
  const channelValue = escapeHtml(plannerState.channels[match.matchId] || '');
  const noteValue = escapeHtml(getNote(match.matchId));
  const saved = !!plannerState.saved[match.matchId];
  const effectiveChannel = escapeHtml(getChannel(match));

  return `
    <article class="match-card ${saved ? 'is-saved' : ''}">
      <div class="match-main">
        <div class="match-time">${match.time || match.eventTime}</div>
        <div class="match-copy">
          <div class="match-topline">
            <span class="tiny-label">${match.series}</span>
            <span class="chip">${effectiveChannel || 'Kanaal onbekend'}</span>
          </div>
          <div class="match-name">${escapeHtml(match.displayName)}</div>
          <div class="meta">${escapeHtml(match.eventTitle)} · ${formatDate(match.date)} · ${escapeHtml(match.location)}</div>
          ${noteValue ? `<div class="note-preview">${noteValue}</div>` : ''}
        </div>
      </div>
      <div class="planner-grid">
        <label>
          <div class="field-hint">Board</div>
          <input class="field-input" data-action="set-board" data-id="${match.matchId}" value="${boardValue}" placeholder="bijv. Board 3">
        </label>
        <label>
          <div class="field-hint">Kanaal</div>
          <input class="field-input" data-action="set-channel" data-id="${match.matchId}" value="${channelValue}" placeholder="bijv. Stream 5">
        </label>
        <label>
          <div class="field-hint">Notitie</div>
          <input class="field-input" data-action="set-note" data-id="${match.matchId}" value="${noteValue}" placeholder="eigen kijknotitie">
        </label>
      </div>
      <div class="planner-actions">
        <button class="mini-btn ${saved ? 'is-saved' : ''}" data-action="toggle-save" data-id="${match.matchId}">${saved ? 'In kijkplan' : 'Bewaar in kijkplan'}</button>
        <button class="mini-btn is-reset" data-action="reset-match" data-id="${match.matchId}">Wis labels</button>
      </div>
    </article>`;
}

function renderSearch() {
  const results = filteredMatches();
  document.getElementById('search-count').textContent = `${results.length} resultaten`;
  const limited = results.slice(0, 24);
  document.getElementById('search-results').innerHTML = limited.length
    ? limited.map((match) => `<div class="result-card">${matchCard(match)}</div>`).join('')
    : '<article class="empty-state">Geen resultaten voor deze filter. Probeer een speler, board, kanaal of eventnaam.</article>';
}

function renderWatchList() {
  const items = savedMatches();
  document.getElementById('watch-count').textContent = `${items.length} bewaard`;
  document.getElementById('watch-list').innerHTML = items.length
    ? items.map((match) => `<article class="watch-card"><div class="watch-top"><span class="chip">${escapeHtml(getChannel(match) || 'Kanaal onbekend')}</span><span class="tiny-label">${escapeHtml(getBoard(match.matchId) || 'Board open')}</span></div><div class="watch-title">${escapeHtml(match.displayName)}</div><div class="meta">${escapeHtml(match.eventTitle)} · ${formatDateLong(match.date)} · ${escapeHtml(match.location)}</div>${getNote(match.matchId) ? `<div class="note-preview">${escapeHtml(getNote(match.matchId))}</div>` : ''}<div class="match-list">${matchCard(match)}</div></article>`).join('')
    : '<article class="empty-state">Nog niets in je kijkplan. Markeer wedstrijden vanuit de zoekresultaten of de kalender.</article>';
}

function renderTimeline() {
  document.getElementById('updated-chip').textContent = `Snapshot ${lastUpdated}`;
  document.getElementById('timeline-list').innerHTML = nextSessions.map((event) => `
    <article class="timeline-card">
      <div class="timeline-top"><span class="chip">${formatDate(event.date)}</span><span class="tiny-label">${event.series}</span></div>
      <div class="result-title">${escapeHtml(event.event)}</div>
      <div class="meta">${escapeHtml(event.location)} · standaard kanaal ${escapeHtml(event.channel)}</div>
      <div class="match-list">${event.matches.slice(0, 4).map((match) => matchCard(match)).join('')}</div>
    </article>`).join('');
}

function renderFocusGrid() {
  const focusItems = [
    {
      title: 'Players Championships',
      copy: 'Gebruik board- en kanaalvelden om losse streams terug te vinden.',
      query: 'players championship'
    },
    {
      title: 'Premier League',
      copy: 'Snelle avondindeling en standings in dezelfde app.',
      query: 'premier league'
    },
    {
      title: 'Majors',
      copy: 'World Matchplay, Grand Slam en Ally Pally in een doorlopende jaarkalender.',
      query: 'world'
    }
  ];

  document.getElementById('focus-grid').innerHTML = focusItems.map((item) => `
    <article class="result-card">
      <div class="result-title">${item.title}</div>
      <div class="meta">${item.copy}</div>
      <button class="btn btn-soft" style="margin-top: 12px;" data-action="preset-query" data-query="${item.query}">Open in zoeken</button>
    </article>`).join('');
}

function renderTournaments() {
  document.getElementById('tournament-count').textContent = `${groupedTournaments.length} toernooien`;
  document.getElementById('tournament-list').innerHTML = groupedTournaments.map((tournament) => `
    <article class="tournament-card">
      <details>
        <summary>
          <div class="tournament-top"><span class="tiny-label">${escapeHtml(tournament.series)}</span><span class="chip">${escapeHtml(tournament.channel)}</span></div>
          <div class="tournament-title">${escapeHtml(tournament.title)}</div>
          <div class="meta">${escapeHtml(tournament.location)} · ${tournament.sessions.length} sessie(s)</div>
        </summary>
        <div class="match-list" style="margin-top: 14px;">${tournament.sessions.map((event) => `
          <article class="result-card">
            <div class="result-top"><span class="chip">${formatDate(event.date)}</span><span class="tiny-label">${escapeHtml(event.time)}</span></div>
            <div class="result-title">${escapeHtml(event.event)}</div>
            <div class="meta">${escapeHtml(event.location)} · standaard kanaal ${escapeHtml(event.channel)}</div>
            <div class="match-list">${event.matches.map((match) => matchCard(match)).join('')}</div>
          </article>`).join('')}</div>
      </details>
    </article>`).join('');
}

function renderPlayers() {
  document.getElementById('player-count').textContent = `${officialPlayers.length} spelers`;
  document.getElementById('players-grid').innerHTML = officialPlayers.map((player) => `
    <article class="player-card">
      <div class="player-top"><span class="rank-pill">${player.ranking}</span><span class="chip">${escapeHtml(formatCountry(player.countryCode))}</span></div>
      <div class="player-name">${escapeHtml(player.name)}</div>
      <div class="meta">${escapeHtml(player.nickname || 'Geen bijnaam')} · ${escapeHtml(player.homeTown || '')}</div>
      <div class="match-list" style="margin-top: 10px; gap: 8px;">
        <div class="source-line">Materiaal: ${escapeHtml(player.darts || 'Onbekend')}</div>
        <div class="source-line">Walk-on: ${escapeHtml(player.walkOn || 'Onbekend')}</div>
        <div class="source-line">Prijzengeld: ${escapeHtml(formatMoney(player.prizeMoney))}</div>
      </div>
    </article>`).join('');
}

function renderStandings() {
  document.getElementById('standings-body').innerHTML = plDartsStandings.map((row) => `
    <tr><td>${row.pos}</td><td>${escapeHtml(row.name)}</td><td>${row.played}</td><td>${row.sf}</td><td>${row.f}</td><td>${row.w}</td><td><strong>${row.pts}</strong></td></tr>`).join('');
}

function renderSources() {
  const sources = [
    `${sourceMeta.players?.label || 'PDC players'} · snapshot ${sourceMeta.players?.snapshotDate || lastUpdated}`,
    `${sourceMeta.calendar?.label || 'Kalender'} · snapshot ${sourceMeta.calendar?.snapshotDate || lastUpdated}`,
    `${sourceMeta.planner?.label || 'Planner'} · lokaal opgeslagen op het toestel`
  ];

  document.getElementById('source-list').innerHTML = sources.map((line) => `<div class="source-line">${escapeHtml(line)}</div>`).join('');
}

function populateSeriesFilter() {
  const series = ['all', ...new Set(parsedEvents.map((event) => event.series))];
  document.getElementById('series-filter').innerHTML = series.map((item) => `
    <option value="${item}">${item === 'all' ? 'Alle series' : item}</option>`).join('');
}

function installInteractions() {
  const searchInput = document.getElementById('search-input');
  const seriesFilter = document.getElementById('series-filter');

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderSearch();
  });

  seriesFilter.addEventListener('change', (event) => {
    state.series = event.target.value;
    renderSearch();
  });

  document.querySelectorAll('[data-filter-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.filterMode;
      document.querySelectorAll('[data-filter-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
      renderSearch();
    });
  });

  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'toggle-save') {
      plannerState.saved[id] = !plannerState.saved[id];
      if (!plannerState.saved[id]) delete plannerState.saved[id];
      persistPlannerState();
      rerenderAll();
    }

    if (action === 'reset-match') {
      delete plannerState.boards[id];
      delete plannerState.channels[id];
      delete plannerState.notes[id];
      persistPlannerState();
      rerenderAll();
    }

    if (action === 'preset-query') {
      const query = target.dataset.query || '';
      state.query = query;
      searchInput.value = query;
      document.getElementById('zoeken').scrollIntoView({ behavior: 'smooth', block: 'start' });
      renderSearch();
    }
  });

  document.body.addEventListener('input', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === 'set-board') plannerState.boards[id] = target.value.trim();
    if (action === 'set-channel') plannerState.channels[id] = target.value.trim();
    if (action === 'set-note') plannerState.notes[id] = target.value.trim();
    if (!target.value.trim()) {
      if (action === 'set-board') delete plannerState.boards[id];
      if (action === 'set-channel') delete plannerState.channels[id];
      if (action === 'set-note') delete plannerState.notes[id];
    }
    persistPlannerState();
    renderSearch();
    renderWatchList();
    renderHero();
  });

  document.getElementById('clear-planner').addEventListener('click', () => {
    plannerState.boards = {};
    plannerState.channels = {};
    plannerState.notes = {};
    persistPlannerState();
    rerenderAll();
  });

  document.getElementById('clear-watchlist').addEventListener('click', () => {
    plannerState.saved = {};
    persistPlannerState();
    rerenderAll();
  });

  document.getElementById('jump-search').addEventListener('click', () => {
    document.getElementById('zoeken').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('jump-watch').addEventListener('click', () => {
    document.getElementById('kijkplan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function setupInstall() {
  let deferredPrompt = null;
  const installBtn = document.getElementById('install-btn');
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

function rerenderAll() {
  renderHero();
  renderSearch();
  renderWatchList();
  renderTimeline();
  renderFocusGrid();
  renderTournaments();
  renderPlayers();
  renderStandings();
  renderSources();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

populateSeriesFilter();
installInteractions();
setupInstall();
rerenderAll();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
