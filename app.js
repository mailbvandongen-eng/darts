const THEME_STORAGE_KEY = 'darts-theme-v1';
const WINDOW_DAYS_BACK = 3;
const WINDOW_DAYS_FORWARD = 21;

const state = {
  isRefreshing: false
};

let scrollObserver = null;
let dartsData = normalizeData(window.DARTS_DATA);
let updatedAt = '';
let playersData = {};
let sourceMeta = {};
let playerMap = {};
let parsedEvents = [];
let groupedByDateMap = {};

const today = new Date();
today.setHours(0, 0, 0, 0);

applyData(dartsData);

function normalizeData(data) {
  return {
    lastUpdated: data?.lastUpdated || '',
    dartsPlayers: data?.dartsPlayers || {},
    plDartsStandings: data?.plDartsStandings || [],
    dartsCalendar: data?.dartsCalendar || [],
    sourceMeta: data?.sourceMeta || {}
  };
}

function applyData(data) {
  dartsData = normalizeData(data);
  updatedAt = dartsData.lastUpdated;
  playersData = dartsData.dartsPlayers;
  sourceMeta = dartsData.sourceMeta;
  playerMap = Object.fromEntries(
    Object.entries(playersData).map(([key, value]) => [key, value.name])
  );
  parsedEvents = dartsData.dartsCalendar.map((event, index) => ({
    ...event,
    id: `${event.date}|${event.time}|${event.event}|${index}`,
    title: event.event,
    baseEvent: normalizeEventName(event.event),
    series: seriesFor(event.event),
    dateObj: new Date(`${event.date}T${event.time || '00:00'}:00`)
  })).sort((a, b) => a.dateObj - b.dateObj);

  groupedByDateMap = parsedEvents.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
}

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

function offsetDate(baseDate, daysToAdd) {
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + daysToAdd);
  return date;
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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  if (button) button.textContent = theme === 'dark' ? 'Licht' : 'Donker';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#050b16' : '#111827');
}

function createWindowDays() {
  const days = [];
  for (let offset = -WINDOW_DAYS_BACK; offset <= WINDOW_DAYS_FORWARD; offset += 1) {
    const date = offsetDate(today, offset);
    const key = formatDateKey(date);
    days.push({ date: key, events: groupedByDateMap[key] || [] });
  }
  return days;
}

function emptyStateCopy(dateString) {
  const yesterdayString = formatDateKey(offsetDate(today, -1));
  const tomorrowString = formatDateKey(offsetDate(today, 1));
  if (dateString === yesterdayString) return 'Geen wedstrijden gisteren';
  if (dateString === getTodayString()) return 'Geen wedstrijden vandaag';
  if (dateString === tomorrowString) return 'Geen wedstrijden morgen';
  return 'Geen wedstrijden';
}

function renderToolbarActions() {
  const currentSection = document.querySelector('.date-tab.active')?.dataset.date || getTodayString();
  const yesterdayDate = formatDateKey(offsetDate(today, -1));
  const tomorrowDate = formatDateKey(offsetDate(today, 1));
  document.getElementById('yesterday-btn').classList.toggle('active', currentSection === yesterdayDate);
  document.getElementById('today-btn').classList.toggle('active', currentSection === getTodayString());
  document.getElementById('tomorrow-btn').classList.toggle('active', currentSection === tomorrowDate);
  document.getElementById('refresh-btn').textContent = state.isRefreshing ? 'Verversen...' : 'Ververs';
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
  const yesterdayKey = formatDateKey(offsetDate(today, -1));
  const tomorrowKey = formatDateKey(offsetDate(today, 1));
  const cards = [
    { date: yesterdayKey, label: 'Gisteren', count: days.find((group) => group.date === yesterdayKey)?.events.length || 0, copy: 'Er was darts' },
    { date: getTodayString(), label: 'Vandaag', count: days.find((group) => group.date === getTodayString())?.events.length || 0, copy: 'Er is darts', highlight: true },
    { date: tomorrowKey, label: 'Morgen', count: days.find((group) => group.date === tomorrowKey)?.events.length || 0, copy: 'Er is darts' }
  ];

  document.getElementById('summary-grid').innerHTML = cards.map((card) => `
    <article class="summary-card jumpable${card.highlight ? ' highlight' : ''}" data-jump-date="${card.date}">
      <div class="summary-label">${card.label}</div>
      <div class="summary-value">${card.count}</div>
      <div class="meta">${card.count ? card.copy : emptyStateCopy(card.date)}</div>
    </article>
  `).join('');

  document.querySelectorAll('[data-jump-date]').forEach((card) => {
    card.addEventListener('click', () => scrollToDate(card.dataset.jumpDate));
  });
}

function renderCalendar() {
  const days = createWindowDays();
  document.getElementById('calendar-meta').textContent = `Gecontroleerd: ${updatedAt || sourceMeta?.calendar?.snapshotDate || '-'}`;
  renderDateTabs(days);

  const container = document.getElementById('day-list');
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
          <div class="meta">${group.events.length ? `${group.events.length} sessie(s)` : emptyStateCopy(group.date)}</div>
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
                            <div class="info-card"><div class="info-label">Kanaal</div><div class="info-value">${escapeHtml(event.channel)}</div></div>
                            <div class="info-card"><div class="info-label">Locatie</div><div class="info-value">${escapeHtml(event.location)}</div></div>
                            <div class="info-card"><div class="info-label">Gecontroleerd</div><div class="info-value">${escapeHtml(updatedAt || sourceMeta?.calendar?.snapshotDate || '-')}</div></div>
                          </div>
                          <div class="match-list">
                            ${(event.matches || []).map((match) => `
                              <div class="match-item">
                                <div class="match-time">${escapeHtml(match.time)}</div>
                                <div>
                                  <div class="match-text">${escapeHtml(formatMatch(match))}</div>
                                  ${match.label ? '<div class="match-note">Sessie bevestigd. Exacte partijen volgen zodra de order of play bekend is.</div>' : ''}
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
        ` : `<div class="empty-state">${escapeHtml(emptyStateCopy(group.date))}</div>`}
      </section>
    `;
  }).join('');

  bindAccordion();
  setupScrollSync();
}

function bindAccordion() {
  document.querySelectorAll('[data-toggle]').forEach((row) => {
    row.addEventListener('click', () => {
      const detail = document.getElementById(row.dataset.toggle);
      const isOpen = detail.classList.contains('open');

      document.querySelectorAll('.event-details.open').forEach((openDetail) => {
        if (openDetail !== detail) openDetail.classList.remove('open');
      });
      document.querySelectorAll('.event-row.open').forEach((openRow) => {
        if (openRow !== row) {
          openRow.classList.remove('open');
          const expand = openRow.querySelector('.expand');
          if (expand) expand.textContent = 'Open';
        }
      });

      detail.classList.toggle('open', !isOpen);
      row.classList.toggle('open', !isOpen);
      const expand = row.querySelector('.expand');
      if (expand) expand.textContent = isOpen ? 'Open' : 'Sluit';
    });
  });
}

function rerender() {
  const days = createWindowDays();
  renderToolbarActions();
  renderSummary(days);
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
      renderToolbarActions();
    });
  }, { rootMargin: `-${headerHeight + dateHeight + 12}px 0px -60% 0px`, threshold: 0.05 });

  sections.forEach((section) => scrollObserver.observe(section));
}

function syncStickyLayout() {
  const headerHeight = document.querySelector('.header')?.offsetHeight || 122;
  const dateStripHeight = document.querySelector('.date-strip')?.offsetHeight || 52;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  document.documentElement.style.setProperty('--date-strip-height', `${dateStripHeight}px`);
}

function parseFetchedData(scriptText) {
  const factory = new Function(`
    "use strict";
    ${scriptText}
    return typeof window !== "undefined" && window.DARTS_DATA
      ? window.DARTS_DATA
      : { lastUpdated, dartsPlayers, plDartsStandings, dartsCalendar, sourceMeta };
  `);
  const nextData = factory();
  if (!nextData?.dartsCalendar) {
    throw new Error('Ongeldige dartsdata ontvangen');
  }
  return nextData;
}

async function refreshVerifiedData() {
  state.isRefreshing = true;
  renderToolbarActions();

  try {
    const response = await fetch(`data.js?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const scriptText = await response.text();
    applyData(parseFetchedData(scriptText));
    rerender();
  } catch (error) {
    console.error('Refresh failed:', error);
    window.alert('Verversen mislukt. Probeer het opnieuw wanneer de nieuwste geverifieerde data beschikbaar is.');
  } finally {
    state.isRefreshing = false;
    renderToolbarActions();
  }
}

document.getElementById('yesterday-btn').addEventListener('click', () => {
  scrollToDate(formatDateKey(offsetDate(today, -1)));
});

document.getElementById('today-btn').addEventListener('click', () => {
  scrollToDate(getTodayString());
});

document.getElementById('tomorrow-btn').addEventListener('click', () => {
  scrollToDate(formatDateKey(offsetDate(today, 1)));
});

document.getElementById('refresh-btn').addEventListener('click', refreshVerifiedData);

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

applyTheme(getPreferredTheme());
rerender();
window.addEventListener('resize', syncStickyLayout);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
