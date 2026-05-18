const APP_VERSION = 'v0.7.7';
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

function sessionPart(timeString) {
  const hour = Number(String(timeString || '0').split(':')[0]);
  if (hour < 6) return 'Nacht';
  if (hour < 12) return 'Ochtend';
  if (hour < 17) return 'Middag';
  return 'Avond';
}

function roundLabel(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('finale') && !text.includes('halve') && !text.includes('kwart')) return 'Finale';
  if (text.includes('halve finale') || text.includes('halve finales')) return 'Halve finales';
  if (text.includes('kwartfinale') || text.includes('kwartfinales')) return 'Kwartfinales';
  if (text.includes('laatste 16')) return 'Laatste 16';
  if (text.includes('laatste 32')) return 'Laatste 32';
  if (text.includes('tweede ronde')) return 'Tweede ronde';
  if (text.includes('eerste ronde')) return 'Eerste ronde';
  if (text.includes('ronde')) return 'Ronde';
  return '';
}

function hasNamedPlayers(match) {
  return Boolean(match && !match.label && (match.home || match.away));
}

function matchSummary(matches) {
  const items = matches || [];
  const namedMatches = items.filter(hasNamedPlayers).slice(0, 3);
  if (namedMatches.length) return namedMatches.map(formatMatch).join(' · ');

  const labels = items.map(formatMatch).filter(Boolean).slice(0, 2);
  if (labels.length) return `${labels.join(' · ')}. Exacte partijen volgen zodra de order of play bekend is.`;

  return 'Exacte partijen volgen zodra de order of play bekend is.';
}

function guideLabel(dateString, index = 0) {
  if (dateString === getTodayString()) return 'Vandaag';
  if (dateString === formatDateKey(offsetDate(today, 1))) return 'Morgen';
  return index === 0 ? 'Eerstvolgende' : 'Daarna';
}

function createGuideDays() {
  const dates = Object.keys(groupedByDateMap)
    .filter((date) => date >= getTodayString())
    .sort();
  const preferredDates = [getTodayString(), formatDateKey(offsetDate(today, 1))].filter((date) => groupedByDateMap[date]?.length);
  const nextDates = dates.filter((date) => !preferredDates.includes(date)).slice(0, Math.max(0, 2 - preferredDates.length));
  return [...preferredDates, ...nextDates].slice(0, 2).map((date) => ({ date, events: groupedByDateMap[date] || [] }));
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
  if (button) {
    button.textContent = theme === 'dark' ? '☀' : '◐';
    button.setAttribute('aria-label', theme === 'dark' ? 'Licht thema' : 'Donker thema');
    button.setAttribute('title', theme === 'dark' ? 'Licht thema' : 'Donker thema');
  }
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#101010' : '#151515');
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
  if (dateString === formatDateKey(offsetDate(today, -1))) return 'Geen wedstrijden gisteren';
  if (dateString === getTodayString()) return 'Geen wedstrijden vandaag';
  if (dateString === formatDateKey(offsetDate(today, 1))) return 'Geen wedstrijden morgen';
  return 'Geen wedstrijden';
}

function renderHeaderActions() {
  const button = document.getElementById('refresh-btn');
  button.textContent = state.isRefreshing ? '…' : '↻';
  button.setAttribute('aria-label', state.isRefreshing ? 'Verversen' : 'Ververs data');
  button.setAttribute('title', state.isRefreshing ? 'Verversen' : 'Ververs data');
}

function renderTvGuide() {
  const container = document.getElementById('tv-guide-days');
  if (!container) return;
  const guideDays = createGuideDays();

  if (!guideDays.length) {
    container.innerHTML = '<div class="session-match">Geen komende sessies in de huidige data. Ververs zodra de nieuwe kalender beschikbaar is.</div>';
    return;
  }

  container.innerHTML = guideDays.map((day, dayIndex) => `
    <section class="tv-day">
      <div class="tv-day-title">
        <span>${escapeHtml(guideLabel(day.date, dayIndex))}</span>
        <span class="tv-day-date">${escapeHtml(formatDate(day.date))}</span>
      </div>
      <div class="session-list">
        ${day.events.map((event) => {
          const round = roundLabel(`${event.event} ${(event.matches || []).map(formatMatch).join(' ')}`);
          return `
            <article class="session-card">
              <div class="session-time">${escapeHtml(event.time)}</div>
              <div>
                <div class="session-title">${escapeHtml(sessionPart(event.time))} · ${escapeHtml(event.title)}</div>
                <div class="session-match">${escapeHtml(matchSummary(event.matches))}</div>
                ${round ? `<div class="round-chip">${escapeHtml(round)}</div>` : ''}
              </div>
              <div class="session-channel">${escapeHtml(event.channel)}</div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `).join('');
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

function renderCalendar() {
  const days = createWindowDays();
  document.getElementById('calendar-meta').textContent = `${APP_VERSION} · gecontroleerd: ${updatedAt || sourceMeta?.calendar?.snapshotDate || '-'}`;
  renderTvGuide();
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
                              <div class="event-sub">${escapeHtml(event.location)}</div>
                            </div>
                            <div class="channel-pill">${escapeHtml(event.channel)}</div>
                            <div class="expand">›</div>
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
          if (expand) expand.textContent = '›';
        }
      });

      detail.classList.toggle('open', !isOpen);
      row.classList.toggle('open', !isOpen);
      const expand = row.querySelector('.expand');
      if (expand) expand.textContent = isOpen ? '›' : '⌄';
    });
  });
}

function rerender() {
  renderHeaderActions();
  renderCalendar();
  syncStickyLayout();
  setTimeout(() => {
    scrollToDate(getTodayString(), false);
  }, 0);
}

function scrollToDate(dateString, smooth = true) {
  const target = document.getElementById(`date-${dateString}`);
  if (!target) return;
  const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
  const dateHeight = document.querySelector('.date-strip')?.offsetHeight || 0;
  const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - dateHeight - 8;
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
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
      centerActiveTab(date);
    });
  }, { rootMargin: `-${headerHeight + dateHeight + 12}px 0px -60% 0px`, threshold: 0.05 });

  sections.forEach((section) => scrollObserver.observe(section));
}

function centerActiveTab(dateString) {
  const container = document.getElementById('date-tabs');
  const activeButton = container.querySelector(`[data-date="${dateString}"]`);
  if (!activeButton) return;
  container.querySelectorAll('.date-tab').forEach((tab) => {
    tab.classList.toggle('active', tab === activeButton);
  });
  const wrapper = document.querySelector('.date-strip');
  wrapper.scrollTo({
    left: activeButton.offsetLeft - ((wrapper.clientWidth - activeButton.clientWidth) / 2),
    behavior: 'smooth'
  });
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
  renderHeaderActions();

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
    renderHeaderActions();
  }
}

document.getElementById('refresh-btn').addEventListener('click', refreshVerifiedData);

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

applyTheme(getPreferredTheme());
rerender();
window.addEventListener('resize', syncStickyLayout);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((registration) => {
    registration.update().catch(() => {});
  }).catch(() => {});
}
