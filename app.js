const { lastUpdated, dartsPlayers, plDartsStandings, dartsCalendar } = window.DARTS_DATA;

const today = new Date();
today.setHours(0, 0, 0, 0);

const state = {
  query: '',
  series: 'all',
  selectedTournament: null
};

const playerMap = Object.fromEntries(
  Object.entries(dartsPlayers).map(([key, value]) => [key, value.name])
);

function normalizeEventName(name) {
  return name.replace(' - Finale', '').replace(' - Play-Offs', '').trim();
}

function seriesFor(name) {
  if (name.startsWith('Premier League Darts')) return 'Premier League';
  if (name.includes('Players Championship')) return 'Players Championship';
  if (name.includes('World Championship') || name.includes('World Matchplay') || name.includes('Grand Slam') || name.includes('Players Championship Finals') || name.includes('European Championship') || name.includes('World Cup')) return 'TV Major';
  if (name.includes('Masters')) return 'World Series';
  if (name.includes('Open') || name.includes('Grand Prix') || name.includes('Trophy')) return 'Tour Event';
  return 'PDC';
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });
}

function formatDateLong(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatMatch(match) {
  if (match.label) return match.label;
  const home = playerMap[match.home] || match.home || 'TBD';
  const away = playerMap[match.away] || match.away || '';
  return away ? `${home} vs ${away}` : home;
}

const parsedEvents = dartsCalendar.map((event, index) => ({
  ...event,
  id: `${normalizeEventName(event.event)}-${event.date}-${index}`,
  baseEvent: normalizeEventName(event.event),
  series: seriesFor(event.event),
  dateObj: new Date(`${event.date}T${event.time || '00:00'}:00`)
})).sort((a, b) => a.dateObj - b.dateObj);

const tournaments = Object.values(parsedEvents.reduce((acc, event) => {
  const key = event.baseEvent;
  if (!acc[key]) {
    acc[key] = {
      id: key,
      title: key,
      series: event.series,
      location: event.location,
      channel: event.channel,
      sessions: []
    };
  }
  acc[key].sessions.push(event);
  return acc;
}, {})).map((tournament) => ({
  ...tournament,
  firstDate: tournament.sessions[0].date,
  lastDate: tournament.sessions[tournament.sessions.length - 1].date,
  searchText: `${tournament.title} ${tournament.series} ${tournament.location}`.toLowerCase()
}));

const upcomingSessions = parsedEvents.filter((event) => event.dateObj >= today);
const nextEvent = upcomingSessions[0] || parsedEvents[parsedEvents.length - 1];

function renderSeriesChips() {
  const container = document.getElementById('series-chips');
  const series = ['all', ...new Set(tournaments.map((item) => item.series))];
  container.innerHTML = series.map((item) => `
    <button class="chip ${state.series === item ? 'active' : ''}" data-series="${item}" type="button">${item === 'all' ? 'Alles' : item}</button>
  `).join('');

  container.querySelectorAll('[data-series]').forEach((button) => {
    button.addEventListener('click', () => {
      state.series = button.dataset.series;
      renderSeriesChips();
      renderTournamentList();
    });
  });
}

function filteredTournaments() {
  const query = state.query.trim().toLowerCase();
  return tournaments.filter((tournament) => {
    if (state.series !== 'all' && tournament.series !== state.series) return false;
    if (!query) return true;
    return tournament.searchText.includes(query);
  });
}

function renderNextEvent() {
  document.getElementById('updated-label').textContent = `Bijgewerkt ${lastUpdated}`;
  document.getElementById('next-event').innerHTML = `
    <div class="next-title">${escapeHtml(nextEvent.event)}</div>
    <div class="meta">${formatDateLong(nextEvent.date)} · ${escapeHtml(nextEvent.time)} · ${escapeHtml(nextEvent.location)}</div>
    <div class="pill-row">
      <span class="pill">${escapeHtml(nextEvent.series)}</span>
      <span class="pill">${escapeHtml(nextEvent.channel)}</span>
      <span class="pill">${nextEvent.matches.length} schema-item(s)</span>
    </div>
  `;
}

function renderUpcoming() {
  const list = upcomingSessions.slice(0, 8);
  document.getElementById('session-count').textContent = `${list.length} van ${upcomingSessions.length}`;
  document.getElementById('upcoming-list').innerHTML = list.map((event) => `
    <article class="card event-card" data-open="${escapeHtml(event.baseEvent)}">
      <div class="event-top">
        <div>
          <div class="event-title">${escapeHtml(event.event)}</div>
          <div class="event-sub">${formatDate(event.date)} · ${escapeHtml(event.time)} · ${escapeHtml(event.location)}</div>
        </div>
        <div class="badge">${escapeHtml(event.channel)}</div>
      </div>
    </article>
  `).join('');
  bindOpenButtons();
}

function renderTournamentList() {
  const list = filteredTournaments();
  document.getElementById('tournament-count').textContent = `${list.length} toernooien`;
  const container = document.getElementById('tournament-list');

  if (!list.length) {
    container.innerHTML = '<div class="card empty">Geen toernooien gevonden.</div>';
    return;
  }

  container.innerHTML = list.map((tournament) => `
    <article class="card event-card" data-open="${escapeHtml(tournament.title)}">
      <div class="event-top">
        <div>
          <div class="event-title">${escapeHtml(tournament.title)}</div>
          <div class="event-sub">${formatDate(tournament.firstDate)}${tournament.firstDate !== tournament.lastDate ? ` t/m ${formatDate(tournament.lastDate)}` : ''} · ${escapeHtml(tournament.location)}</div>
        </div>
        <div class="badge">${escapeHtml(tournament.series)}</div>
      </div>
      <div class="pill-row">
        <span class="pill">${tournament.sessions.length} sessie(s)</span>
        <span class="pill">${escapeHtml(tournament.channel)}</span>
      </div>
    </article>
  `).join('');

  bindOpenButtons();
}

function renderStandings() {
  document.getElementById('standings-body').innerHTML = plDartsStandings.map((row) => `
    <tr>
      <td>${row.pos}</td>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.played}</td>
      <td>${row.sf}</td>
      <td>${row.f}</td>
      <td>${row.w}</td>
      <td><strong>${row.pts}</strong></td>
    </tr>
  `).join('');
}

function openTournament(title) {
  const tournament = tournaments.find((item) => item.title === title);
  if (!tournament) return;

  state.selectedTournament = tournament.title;
  document.getElementById('detail-title').textContent = tournament.title;
  document.getElementById('detail-series').textContent = tournament.series;
  document.getElementById('detail-meta').textContent = `${tournament.location} · ${tournament.channel} · ${tournament.sessions.length} sessie(s)`;
  document.getElementById('detail-body').innerHTML = tournament.sessions.map((session) => `
    <article class="card session-card">
      <div class="session-head">
        <div>
          <div class="session-title">${escapeHtml(session.event)}</div>
          <div class="meta">${formatDateLong(session.date)} · ${escapeHtml(session.time)} · ${escapeHtml(session.location)}</div>
        </div>
        <div class="badge">${escapeHtml(session.channel)}</div>
      </div>
      <div class="match-list">
        ${session.matches.map((match) => `
          <div class="match-item">
            <div class="match-time">${escapeHtml(match.time)}</div>
            <div>
              <div class="match-text">${escapeHtml(formatMatch(match))}</div>
              ${match.label ? '<div class="mini-note">Sessie of ronde-overzicht</div>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');

  const overlay = document.getElementById('detail-overlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTournament() {
  const overlay = document.getElementById('detail-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindOpenButtons() {
  document.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => openTournament(button.dataset.open));
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setupEvents() {
  document.getElementById('search-input').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderTournamentList();
  });

  document.getElementById('close-detail').addEventListener('click', closeTournament);
  document.getElementById('detail-overlay').addEventListener('click', (event) => {
    if (event.target.id === 'detail-overlay') closeTournament();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTournament();
  });
}

renderSeriesChips();
renderNextEvent();
renderUpcoming();
renderTournamentList();
renderStandings();
setupEvents();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
