const dartsData = window.DARTS_DATA;
const updatedAt = dartsData.lastUpdated;
const playersData = dartsData.dartsPlayers;
const standingsData = dartsData.plDartsStandings;
const calendarData = dartsData.dartsCalendar;

const WINDOW_DAYS_BACK = 3;
const WINDOW_DAYS_FORWARD = 21;
const WATCHLIST_STORAGE_KEY = 'darts-watchlist-v1';
const THEME_STORAGE_KEY = 'darts-theme-v1';

const state = {
  query: '',
  series: 'all',
  savedOnly: false
};

let scrollObserver = null;
let watchlistIds = loadWatchlist();

const today = new Date();
today.setHours(0, 0, 0, 0);

const playerMap = Object.fromEntries(
  Object.entries(playersData).map(([key, value]) => [key, value.name])
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
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function formatShortDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
  const months = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getTodayString() {
  return formatDateKey(today);
}

function isToday(dateString) {
  return dateString === getTodayString();
}

function formatMatch(match) {
  if (match.label) return match.label;
  const home = playerMap[match.home] || match.home || 'TBD';
  const away = playerMap[match.away] || match.away || '';
  return away ? `${home} vs ${away}` : home;
}

function searchableEventText(event) {
  const matchText = event.matches.map((match) => {
    const home = playerMap[match.home] || match.home || '';
    const away = playerMap[match.away] || match.away || '';
    return `${match.time} ${match.label || ''} ${home} ${away}`;
  }).join(' ');

  return `${event.title} ${event.location} ${event.series} ${event.channel} ${matchText}`.toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadWatchlist() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WATCHLIST_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveWatchlist() {
  window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...watchlistIds]));
}

function getPreferredTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  const button = document.getElementById('theme-toggle');
  if (button) button.textContent = theme === 'dark' ? 'Licht thema' : 'Donker thema';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#050b16' : '#111827');
}

const parsedEvents = calendarData.map((event, index) => ({
  ...event,
  id: `${event.date}|${event.time}|${event.event}|${event.location}|${index}`,
  title: event.event,
  baseEvent: normalizeEventName(event.event),
  series: seriesFor(event.event),
  dateObj: new Date(`${event.date}T${event.time || '00:00'}:00`)
})).sort((a, b) => a.dateObj - b.dateObj);

const groupedByDateMap = parsedEvents.reduce((acc, event) => {
  if (!acc[event.date]) acc[event.date] = [];
  acc[event.date].push(event);
  return acc;
}, {});

function createWindowDays() {
  const days = [];
  for (let offset = -WINDOW_DAYS_BACK; offset <= WINDOW_DAYS_FORWARD; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const key = formatDateKey(date);
    days.push({ date: key, events: groupedByDateMap[key] || [] });
  }
  return days;
}

function filteredDays() {
  const query = state.query.trim().toLowerCase();
  const days = createWindowDays().map((group) => {
    const events = group.events.filter((event) => {
      if (state.savedOnly && !watchlistIds.has(event.id)) return false;
      if (state.series !== 'all' && event.series !== state.series) return false;
      if (!query) return true;
      return searchableEventText(event).includes(query);
    });
    return { ...group, events };
  });

  if (!query && state.series === 'all') return days;
  return days.filter((group) => group.events.length > 0);
}

function renderSeriesRow() {
  const series = ['all', ...new Set(parsedEvents.map((event) => event.series))];
  const container = document.getElementById('series-row');
  container.innerHTML = series.map((seriesName) => `
    <button class="chip ${state.series === seriesName ? 'active' : ''}" data-series="${seriesName}" type="button">${seriesName === 'all' ? 'Alles' : seriesName}</button>
  `).join('');

  container.querySelectorAll('[data-series]').forEach((button) => {
    button.addEventListener('click', () => {
      state.series = button.dataset.series;
      rerenderCalendar();
    });
  });
}

function renderToolbarActions() {
  const savedFilterButton = document.getElementById('saved-filter-btn');
  const todayButton = document.getElementById('today-btn');

  if (savedFilterButton) {
    savedFilterButton.textContent = state.savedOnly ? 'Alleen kijkplan' : 'Alle sessies';
    savedFilterButton.classList.toggle('active', state.savedOnly);
  }

  if (todayButton) {
    todayButton.classList.toggle('active', !state.query && !state.savedOnly && state.series === 'all');
  }
}

function renderDateTabs(days) {
  const container = document.getElementById('date-tabs');
  const todayString = getTodayString();
  container.innerHTML = days.map((group) => `
    <button class="date-tab${group.date === todayString ? ' active' : ''}" data-date="${group.date}" type="button">${isToday(group.date) ? 'VANDAAG' : formatShortDate(group.date)}</button>
  `).join('');

  container.querySelectorAll('[data-date]').forEach((button) => {
    button.addEventListener('click', () => scrollToDate(button.dataset.date));
  });

  const activeButton = container.querySelector('.date-tab.active');
  if (activeButton) {
    container.scrollLeft = activeButton.offsetLeft - ((container.clientWidth - activeButton.clientWidth) / 2);
  }
}

function renderSummary(days) {
  const visibleEvents = days.flatMap((group) => group.events);
  const nextEvent = visibleEvents.find((event) => event.dateObj >= today) || parsedEvents.find((event) => event.dateObj >= today) || parsedEvents[parsedEvents.length - 1];

  document.getElementById('summary-grid').innerHTML = `
    <article class="summary-card">
      <div class="summary-label">Vandaag</div>
      <div class="summary-value">${days.find((group) => group.date === getTodayString())?.events.length || 0}</div>
      <div class="meta">event(s) op ${formatDate(getTodayString())}</div>
    </article>
    <article class="summary-card">
      <div class="summary-label">Eerstvolgende sessie</div>
      <div class="summary-value">${escapeHtml(nextEvent.time)}</div>
      <div class="meta">${escapeHtml(nextEvent.title)} · ${formatDate(nextEvent.date)}</div>
    </article>
    <article class="summary-card highlight">
      <div class="summary-label">Kijkplan</div>
      <div class="summary-value">${watchlistIds.size}</div>
      <div class="meta">${watchlistIds.size ? 'bewaarde sessie(s)' : 'sla sessies op vanuit de kalender'}</div>
    </article>
    <article class="summary-card">
      <div class="summary-label">Venster</div>
      <div class="summary-value">${visibleEvents.length}</div>
      <div class="meta">${WINDOW_DAYS_BACK} dagen terug · 3 weken vooruit · update ${updatedAt}</div>
    </article>
  `;
}

function renderCalendar() {
  const days = filteredDays();
  const totalVisibleEvents = days.reduce((sum, group) => sum + group.events.length, 0);
  document.getElementById('calendar-meta').textContent = `${days.length} d · ${totalVisibleEvents} evt`;
  renderDateTabs(days);

  const container = document.getElementById('day-list');
  if (!days.length) {
    container.innerHTML = '<div class="empty-state">Geen resultaten voor deze filter.</div>';
    return;
  }

  container.innerHTML = days.map((group) => {
    const competitionMap = group.events.reduce((acc, event) => {
      if (!acc[event.baseEvent]) acc[event.baseEvent] = [];
      acc[event.baseEvent].push(event);
      return acc;
    }, {});

    const competitions = Object.entries(competitionMap).map(([name, events]) => ({
      name,
      series: events[0].series,
      events
    }));

    return `
      <section class="day-section" data-date="${group.date}" id="date-${group.date}">
        <div class="day-header">
          <div class="day-title">${isToday(group.date) ? 'Vandaag' : escapeHtml(formatDate(group.date))}</div>
          <div class="meta">${group.events.length} event(s)</div>
        </div>
        ${competitions.length ? `
          <div class="competition-list">
            ${competitions.map((competition, competitionIndex) => `
              <article class="competition-block">
                <div class="competition-head">
                  <div class="competition-name">${escapeHtml(competition.name)}</div>
                  <div class="badge">${escapeHtml(competition.series)}</div>
                </div>
                <div class="event-list">
                  ${competition.events.map((event, eventIndex) => {
                    const detailId = `detail-${group.date}-${competitionIndex}-${eventIndex}`;
                    return `
                      <div>
                        <div class="event-row" data-toggle="${detailId}">
                          <div class="event-main">
                            <div class="time">${escapeHtml(event.time)}</div>
                            <div>
                              <div class="event-title">${escapeHtml(event.title)}</div>
                              <div class="event-sub">${escapeHtml(event.location)} · ${escapeHtml(event.channel)}</div>
                            </div>
                            <div class="expand">Open</div>
                          </div>
                        </div>
                        <div class="event-details" id="${detailId}">
                          <div class="info-grid">
                            <div class="info-card"><div class="info-label">Toernooi</div><div class="info-value">${escapeHtml(event.baseEvent)}</div></div>
                            <div class="info-card"><div class="info-label">Serie</div><div class="info-value">${escapeHtml(event.series)}</div></div>
                            <div class="info-card"><div class="info-label">Locatie</div><div class="info-value">${escapeHtml(event.location)}</div></div>
                            <div class="info-card"><div class="info-label">Kanaal</div><div class="info-value">${escapeHtml(event.channel)}</div></div>
                          </div>
                          <div class="button-row">
                            <button class="action-btn watch-toggle" data-watch-id="${escapeHtml(event.id)}" type="button">Bewaar in kijkplan</button>
                          </div>
                          <div class="match-list">
                            ${event.matches.map((match) => `
                              <div class="match-item">
                                <div class="match-time">${escapeHtml(match.time)}</div>
                                <div>
                                  <div class="match-text">${escapeHtml(formatMatch(match))}</div>
                                  ${match.label ? '<div class="match-note">Exacte partijen volgen zodra loting of order of play bekend is.</div>' : ''}
                                </div>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        ` : '<div class="empty-state">Geen darts op deze dag.</div>'}
      </section>
    `;
  }).join('');

  bindAccordion();
  renderWatchButtons();
  setupScrollSync();
}

function bindAccordion() {
  document.querySelectorAll('[data-toggle]').forEach((row) => {
    row.addEventListener('click', () => {
      const detail = document.getElementById(row.dataset.toggle);
      const isOpen = detail.classList.contains('open');
      detail.classList.toggle('open', !isOpen);
      row.classList.toggle('open', !isOpen);
      const expand = row.querySelector('.expand');
      if (expand) expand.textContent = isOpen ? 'Open' : 'Sluit';
    });
  });
}

function renderStandings() {
  document.getElementById('standings-body').innerHTML = standingsData.map((row) => `
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

function renderWatchButtons() {
  document.querySelectorAll('.watch-toggle').forEach((button) => {
    const saved = watchlistIds.has(button.dataset.watchId);
    button.textContent = saved ? 'Verwijder uit kijkplan' : 'Bewaar in kijkplan';
    button.classList.toggle('primary', !saved);
    button.addEventListener('click', () => toggleWatch(button.dataset.watchId));
  });
}

function renderWatchlist() {
  const container = document.getElementById('watchlist');
  const events = parsedEvents.filter((event) => watchlistIds.has(event.id)).sort((a, b) => a.dateObj - b.dateObj);
  document.getElementById('watchlist-meta').textContent = `${events.length} sessie(s)`;

  if (!events.length) {
    container.innerHTML = '<div class="empty-state">Nog geen sessies bewaard. Open een event en zet het in je kijkplan.</div>';
    return;
  }

  container.innerHTML = events.map((event) => `
    <article class="watch-card">
      <div class="watch-head">
        <div>
          <div class="watch-title">${escapeHtml(event.title)}</div>
          <div class="watch-meta">${escapeHtml(formatDate(event.date))} · ${escapeHtml(event.time)} · ${escapeHtml(event.location)}</div>
        </div>
        <div class="badge">${escapeHtml(event.channel)}</div>
      </div>
      <div class="watch-actions">
        <div class="watch-meta">${escapeHtml(event.series)}</div>
        <div class="button-row">
          <button class="action-btn primary" data-jump-date="${escapeHtml(event.date)}" type="button">Ga naar dag</button>
          <button class="action-btn watch-remove" data-watch-id="${escapeHtml(event.id)}" type="button">Verwijder</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('[data-jump-date]').forEach((button) => {
    button.addEventListener('click', () => scrollToDate(button.dataset.jumpDate));
  });

  container.querySelectorAll('.watch-remove').forEach((button) => {
    button.addEventListener('click', () => toggleWatch(button.dataset.watchId));
  });
}

function toggleWatch(eventId) {
  if (watchlistIds.has(eventId)) {
    watchlistIds.delete(eventId);
  } else {
    watchlistIds.add(eventId);
  }
  saveWatchlist();
  rerenderCalendar();
}

function syncStickyLayout() {
  const headerHeight = document.querySelector('.header')?.offsetHeight || 122;
  const dateStripHeight = document.querySelector('.date-strip')?.offsetHeight || 52;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  document.documentElement.style.setProperty('--date-strip-height', `${dateStripHeight}px`);
}

function rerenderCalendar() {
  renderToolbarActions();
  renderSeriesRow();
  const days = filteredDays();
  renderSummary(days);
  renderWatchlist();
  renderCalendar();
  syncStickyLayout();
}

function scrollToDate(dateString) {
  const target = document.getElementById(`date-${dateString}`);
  if (!target) return;
  const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
  const dateHeight = document.querySelector('.date-strip')?.offsetHeight || 0;
  const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - dateHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

function setupScrollSync() {
  const sections = document.querySelectorAll('.day-section[data-date]');
  const tabs = document.querySelectorAll('.date-tab[data-date]');
  if (!sections.length || !tabs.length) return;

  if (scrollObserver) scrollObserver.disconnect();

  const headerHeight = document.querySelector('.header')?.offsetHeight || 122;
  const dateHeight = document.querySelector('.date-strip')?.offsetHeight || 52;

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const date = entry.target.dataset.date;
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.date === date));
    });
  }, { rootMargin: `-${headerHeight + dateHeight + 12}px 0px -60% 0px`, threshold: 0.05 });

  sections.forEach((section) => scrollObserver.observe(section));
}

document.getElementById('search-input').addEventListener('input', (event) => {
  state.query = event.target.value;
  rerenderCalendar();
});

document.getElementById('today-btn').addEventListener('click', () => {
  state.query = '';
  state.series = 'all';
  state.savedOnly = false;
  document.getElementById('search-input').value = '';
  rerenderCalendar();
  scrollToDate(getTodayString());
});

document.getElementById('saved-filter-btn').addEventListener('click', () => {
  state.savedOnly = !state.savedOnly;
  rerenderCalendar();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

applyTheme(getPreferredTheme());
renderStandings();
rerenderCalendar();
window.addEventListener('resize', syncStickyLayout);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
