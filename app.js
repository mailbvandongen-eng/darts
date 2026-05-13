const dartsData = window.DARTS_DATA;
const updatedAt = dartsData.lastUpdated;
const playersData = dartsData.dartsPlayers;
const standingsData = dartsData.plDartsStandings;
const calendarData = dartsData.dartsCalendar;

const state = {
  query: '',
  series: 'all'
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const playerMap = Object.fromEntries(Object.entries(playersData).map(([key, value]) => [key, value.name]));

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
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatShortDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
  const months = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatMatch(match) {
  if (match.label) return match.label;
  const home = playerMap[match.home] || match.home || 'TBD';
  const away = playerMap[match.away] || match.away || '';
  return away ? `${home} vs ${away}` : home;
}

const parsedEvents = calendarData.map((event, index) => ({
  ...event,
  id: `event-${index}`,
  title: event.event,
  baseEvent: normalizeEventName(event.event),
  series: seriesFor(event.event),
  dateObj: new Date(`${event.date}T${event.time || '00:00'}:00`)
})).sort((a, b) => a.dateObj - b.dateObj);

const groupedByDate = Object.entries(parsedEvents.reduce((acc, event) => {
  if (!acc[event.date]) acc[event.date] = [];
  acc[event.date].push(event);
  return acc;
}, {})).map(([date, events]) => ({ date, events }));

function filteredDays() {
  const query = state.query.trim().toLowerCase();
  return groupedByDate.map((group) => {
    const events = group.events.filter((event) => {
      if (state.series !== 'all' && event.series !== state.series) return false;
      if (!query) return true;
      return `${event.title} ${event.location} ${event.series} ${event.channel}`.toLowerCase().includes(query);
    });
    return { ...group, events };
  }).filter((group) => group.events.length > 0);
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

function renderDateTabs(days) {
  const container = document.getElementById('date-tabs');
  container.innerHTML = days.map((group) => `
    <button class="date-tab${group.date === currentAnchorDate(days) ? ' active' : ''}" data-date="${group.date}" type="button">${labelForTab(group.date)}</button>
  `).join('');

  container.querySelectorAll('[data-date]').forEach((button) => {
    button.addEventListener('click', () => scrollToDate(button.dataset.date));
  });
}

function labelForTab(dateString) {
  return isToday(dateString) ? 'VANDAAG' : formatShortDate(dateString);
}

function currentAnchorDate(days) {
  const todayString = getTodayString();
  return days.find((group) => group.date >= todayString)?.date || days[0]?.date || todayString;
}

function renderSummary(days) {
  const upcoming = parsedEvents.filter((event) => event.dateObj >= today);
  const nextEvent = upcoming[0] || parsedEvents[parsedEvents.length - 1];
  const tournaments = new Set(parsedEvents.map((event) => event.baseEvent));
  document.getElementById('summary-grid').innerHTML = `
    <article class="summary-card">
      <div class="summary-label">Eerstvolgende sessie</div>
      <div class="summary-value">${escapeHtml(nextEvent.time)}</div>
      <div class="meta">${escapeHtml(nextEvent.title)} · ${formatDate(nextEvent.date)}</div>
    </article>
    <article class="summary-card">
      <div class="summary-label">Sessies</div>
      <div class="summary-value">${parsedEvents.length}</div>
      <div class="meta">Bijgewerkt ${updatedAt}</div>
    </article>
    <article class="summary-card">
      <div class="summary-label">Toernooien</div>
      <div class="summary-value">${tournaments.size}</div>
      <div class="meta">${days.length} dagen zichtbaar</div>
    </article>
  `;
}

function renderCalendar() {
  const days = filteredDays();
  document.getElementById('calendar-meta').textContent = `${days.length} dagen · ${days.reduce((sum, group) => sum + group.events.length, 0)} events`;
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
      channel: events[0].channel,
      series: events[0].series,
      events
    }));

    return `
      <section class="day-section" data-date="${group.date}" id="date-${group.date}">
        <div class="day-header">
          <div class="day-title">${isToday(group.date) ? 'Vandaag' : escapeHtml(formatDate(group.date))}</div>
          <div class="meta">${group.events.length} event(s)</div>
        </div>
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

function rerenderCalendar() {
  renderSeriesRow();
  const days = filteredDays();
  renderSummary(days);
  renderCalendar();
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const date = entry.target.dataset.date;
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.date === date));
    });
  }, { rootMargin: '-220px 0px -60% 0px', threshold: 0.05 });

  sections.forEach((section) => observer.observe(section));
}

function isToday(dateString) {
  return dateString === getTodayString();
}

function getTodayString() {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.getElementById('search-input').addEventListener('input', (event) => {
  state.query = event.target.value;
  rerenderCalendar();
});

renderStandings();
rerenderCalendar();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
