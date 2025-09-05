/*
  CityBus Tracker — Static Prototype
  - Screen 1: Launch
  - Screen 2: Route/Stop selection with Search
  - Screen 3: Results with top-right summary box and per-bus info buttons
*/

// ---------- Sample Data ----------
/**
 * Routes with stops and associated bus units. No schedules baked in; we simulate arrivals per search.
 */
const SAMPLE_ROUTES = [
  {
    id: '1',
    name: '1 Downtown Loop',
    color: '#2563eb',
    stops: ['Main St', 'Central Park', 'Museum', 'Stadium'],
    buses: [
      { id: '1A', driver: 'Sam Lee', capacity: 42, wheelchair: true, features: ['AC', 'Wi‑Fi'] },
      { id: '1B', driver: 'Ava Chen', capacity: 40, wheelchair: true, features: ['AC'] },
      { id: '1C', driver: 'Luis Gomez', capacity: 40, wheelchair: true, features: ['AC', 'USB Power'] }
    ]
  },
  {
    id: '2',
    name: '2 University Express',
    color: '#16a34a',
    stops: ['Union Station', 'Library', 'Science Park', 'Campus Gate'],
    buses: [
      { id: '2X', driver: 'Diego Ramos', capacity: 38, wheelchair: true, features: ['AC', 'USB Power'] },
      { id: '2Y', driver: 'Maya Patel', capacity: 38, wheelchair: true, features: ['AC'] }
    ]
  },
  {
    id: '5',
    name: '5 Airport Link',
    color: '#ea580c',
    stops: ['City Center', 'East Hub', 'Airport T1', 'Airport T2'],
    buses: [
      { id: '5A', driver: 'Noah Brooks', capacity: 45, wheelchair: true, features: ['AC', 'Wi‑Fi', 'Luggage Rack'] },
      { id: '5B', driver: 'Riya Singh', capacity: 45, wheelchair: true, features: ['AC', 'USB Power'] }
    ]
  }
];

// ---------- State ----------
const appState = {
  routes: SAMPLE_ROUTES,
  selectedRouteId: null,
  selectedStop: null,
  searchResults: [] // computed arrivals for the last search
};

// ---------- Utilities ----------
function byId(id) { return document.getElementById(id); }

/** Returns the selected route object or undefined */
function getSelectedRoute() {
  return appState.routes.find(r => r.id === appState.selectedRouteId);
}

/** Format minutes to human-friendly string */
function formatEtaMinutes(totalMinutes) {
  if (totalMinutes <= 0) return 'Due';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hr ${minutes} min`;
}

/** Format a Date into clock time HH:MM */
function formatClock(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** Random integer in [min, max] inclusive */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute a simulated set of arrivals for a given route and stop.
 * - ETA: 3–20 minutes from now
 * - 40% chance of a delay of 2–8 minutes
 */
function computeArrivals(route, stopName) {
  const now = new Date();
  const arrivals = route.buses.map((bus) => {
    const etaMinutes = randInt(3, 20);
    const delayed = Math.random() < 0.4;
    const delayMinutes = delayed ? randInt(2, 8) : 0;
    const scheduledArrival = new Date(now.getTime() + (etaMinutes - delayMinutes) * 60000);
    const expectedArrival = new Date(now.getTime() + etaMinutes * 60000);
    return {
      routeId: route.id,
      routeName: route.name,
      stopName,
      busId: bus.id,
      driver: bus.driver,
      capacity: bus.capacity,
      wheelchair: bus.wheelchair,
      features: bus.features,
      color: route.color,
      etaMinutes,
      delayMinutes,
      scheduledArrival,
      expectedArrival
    };
  });
  // Show soonest arrivals first
  arrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);
  return arrivals;
}

// ---------- Rendering ----------
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  byId(screenId).classList.add('active');
}

function populateRouteSelect() {
  const select = byId('routeSelect');
  select.innerHTML = appState.routes
    .map(r => `<option value="${r.id}">${r.name}</option>`) // name includes route number
    .join('');
  // default selection
  const firstRoute = appState.routes[0];
  if (firstRoute) {
    appState.selectedRouteId = firstRoute.id;
    populateStopSelect(firstRoute.id);
  }
}

function populateStopSelect(routeId) {
  const route = appState.routes.find(r => r.id === routeId);
  const select = byId('stopSelect');
  select.innerHTML = (route?.stops || [])
    .map(s => `<option value="${s}">${s}</option>`)
    .join('');
  appState.selectedStop = route?.stops?.[0] || null;
}

function renderResults(arrivals) {
  const list = byId('busList');
  const meta = byId('resultsMeta');
  const route = getSelectedRoute();

  meta.textContent = `${route?.name || ''} • ${appState.selectedStop || ''}`;

  if (!arrivals.length) {
    list.innerHTML = `<li class="card">No buses found.</li>`;
    return;
  }

  const itemsHtml = arrivals.map((a) => {
    const delayClass = a.delayMinutes > 0 ? 'danger' : 'success';
    const delayText = a.delayMinutes > 0 ? `${a.delayMinutes} min delay` : 'On time';
    return `
      <li class="card" data-bus="${a.busId}">
        <div class="title">
          <span style="display:inline-flex;align-items:center;gap:8px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:999px;background:${a.color}"></span>
            ${a.busId}
          </span>
          <button class="icon-btn small info-btn" aria-label="Show bus details" data-bus="${a.busId}">i</button>
        </div>
        <div style="text-align:right; font-weight:800">${formatEtaMinutes(a.etaMinutes)}</div>

        <div class="subtitle">${a.routeName} • ${a.stopName}</div>
        <div class="row">
          <span class="chip ${delayClass}">
            <span class="dot">•</span>
            ${delayText}
          </span>
          <span class="chip">Arrives at ${formatClock(a.expectedArrival)}</span>
          <span class="spacer"></span>
        </div>
      </li>
    `;
  }).join('');

  list.innerHTML = itemsHtml;

  // Wire up info buttons
  list.querySelectorAll('.info-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const busId = e.currentTarget.getAttribute('data-bus');
      const details = arrivals.find(x => x.busId === busId);
      if (details) openBusDetails(details);
    });
  });
}

function updateSummaryBox(arrivals) {
  const next = arrivals[0];
  if (!next) return;
  byId('summaryBus').textContent = next.busId;
  byId('summaryEta').textContent = formatEtaMinutes(next.etaMinutes);
  byId('summaryStop').textContent = next.stopName;
  byId('summaryDelay').textContent = next.delayMinutes > 0 ? `${next.delayMinutes} min delay` : 'On time';
}

// ---------- Modal ----------
function openBusDetails(details) {
  const body = byId('modalBody');
  const featureList = details.features.map(f => `<li>${f}</li>`).join('');
  body.innerHTML = `
    <div class="row" style="align-items:flex-start">
      <div style="font-weight:800; font-size:18px">Bus ${details.busId}</div>
      <span class="spacer"></span>
      <span class="chip">Route ${details.routeName}</span>
    </div>
    <div class="row" style="margin-top:8px">
      <div><strong>Driver</strong>: ${details.driver}</div>
      <div><strong>Capacity</strong>: ${details.capacity}</div>
      <div><strong>Wheelchair</strong>: ${details.wheelchair ? 'Yes' : 'No'}</div>
    </div>
    <div style="margin-top:10px">
      <strong>Features</strong>
      <ul style="margin:6px 0 0 18px">${featureList}</ul>
    </div>
    <div style="margin-top:10px; color: var(--muted)">
      Scheduled: ${formatClock(details.scheduledArrival)} • Expected: ${formatClock(details.expectedArrival)}
    </div>
  `;
  byId('modal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  byId('modal').setAttribute('aria-hidden', 'true');
}

// ---------- Event wiring ----------
function wireEvents() {
  byId('btn-start').addEventListener('click', () => navigateTo('screen-select'));
  byId('back-to-launch').addEventListener('click', () => navigateTo('screen-launch'));
  byId('back-to-select').addEventListener('click', () => navigateTo('screen-select'));

  byId('routeSelect').addEventListener('change', (e) => {
    const newRouteId = e.target.value;
    appState.selectedRouteId = newRouteId;
    populateStopSelect(newRouteId);
  });

  byId('stopSelect').addEventListener('change', (e) => {
    appState.selectedStop = e.target.value;
  });

  byId('btn-search').addEventListener('click', () => {
    const route = getSelectedRoute();
    if (!route || !appState.selectedStop) return;
    const arrivals = computeArrivals(route, appState.selectedStop);
    appState.searchResults = arrivals;
    renderResults(arrivals);
    updateSummaryBox(arrivals);
    navigateTo('screen-results');
  });

  byId('modalBackdrop').addEventListener('click', closeModal);
  byId('modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ---------- Init ----------
function init() {
  populateRouteSelect();
  wireEvents();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

