/* Bus Tracker Prototype - Single-file JS state + view swapper */
(function () {
  const screens = {
    launch: document.getElementById('screen-launch'),
    select: document.getElementById('screen-select'),
    results: document.getElementById('screen-results')
  };

  const buttons = {
    getStarted: document.getElementById('btn-get-started'),
    backFromSelect: document.getElementById('btn-back-from-select'),
    backFromResults: document.getElementById('btn-back-from-results'),
    search: document.getElementById('btn-search')
  };

  const inputs = {
    routeSelect: document.getElementById('route-select'),
    busSearch: document.getElementById('bus-search')
  };

  const resultsEls = {
    routeTitle: document.getElementById('results-route-title'),
    busList: document.getElementById('bus-list'),
    panel: {
      busNumber: document.getElementById('panel-bus-number'),
      arrivalTime: document.getElementById('panel-arrival-time'),
      delay: document.getElementById('panel-delay')
    }
  };

  const modalEls = {
    overlay: document.getElementById('modal-overlay'),
    close: document.getElementById('modal-close'),
    content: document.getElementById('modal-content'),
    title: document.getElementById('modal-title')
  };

  /**
   * Mock data for routes and buses
   */
  const mockRoutes = [
    {
      id: 'r1',
      name: 'Blue Line - Downtown ⟷ Uptown',
      code: 'BLU',
      buses: [
        { busNumber: 'B12', arrivalMins: 3, delayMins: 0, lastStop: '3rd & Pine', capacity: 45, occupancy: 18, plate: 'ABX-1234', driver: 'M. Singh' },
        { busNumber: 'B19', arrivalMins: 9, delayMins: 2, lastStop: '5th & Main', capacity: 45, occupancy: 30, plate: 'JHK-4582', driver: 'C. Gomez' },
        { busNumber: 'B07', arrivalMins: 14, delayMins: 0, lastStop: 'Union Sq', capacity: 45, occupancy: 41, plate: 'POQ-9901', driver: 'A. Chen' }
      ]
    },
    {
      id: 'r2',
      name: 'Green Loop - Central ⟲',
      code: 'GRN',
      buses: [
        { busNumber: 'G02', arrivalMins: 2, delayMins: 1, lastStop: 'Central Hub', capacity: 40, occupancy: 10, plate: 'GRN-2042', driver: 'D. Patel' },
        { busNumber: 'G05', arrivalMins: 12, delayMins: 0, lastStop: 'Elm St', capacity: 40, occupancy: 35, plate: 'GRN-5521', driver: 'R. Lee' }
      ]
    },
    {
      id: 'r3',
      name: 'Red Express - Airport ⟷ Midtown',
      code: 'RED',
      buses: [
        { busNumber: 'R1X', arrivalMins: 7, delayMins: 0, lastStop: 'Harbor', capacity: 55, occupancy: 22, plate: 'RED-9900', driver: 'S. O\'Brien' },
        { busNumber: 'R9X', arrivalMins: 17, delayMins: 5, lastStop: 'Tech Park', capacity: 55, occupancy: 48, plate: 'RED-6612', driver: 'T. Kim' }
      ]
    }
  ];

  const AppState = {
    currentScreen: 'launch',
    selectedRouteId: null,
    busQuery: '',
    get selectedRoute() {
      return mockRoutes.find(r => r.id === this.selectedRouteId) || null;
    }
  };

  function navigateTo(screenName) {
    Object.keys(screens).forEach(k => {
      const el = screens[k];
      const makeVisible = k === screenName;
      if (makeVisible) {
        el.removeAttribute('hidden');
        el.classList.add('active');
      } else {
        el.setAttribute('hidden', '');
        el.classList.remove('active');
      }
    });
    AppState.currentScreen = screenName;
  }

  function formatAbsoluteTimeFromNow(minsFromNow) {
    const now = new Date();
    const then = new Date(now.getTime() + minsFromNow * 60 * 1000);
    const hours = then.getHours().toString().padStart(2, '0');
    const minutes = then.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function formatDelayPill(delayMins) {
    if (!delayMins || delayMins <= 0) {
      return `<span class="pill ontime">On time</span>`;
    }
    return `<span class="pill delay">+${delayMins} min delay</span>`;
  }

  function renderRoutes() {
    // Populate options only once
    if (inputs.routeSelect.children.length <= 1) {
      mockRoutes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = `${route.name}`;
        inputs.routeSelect.appendChild(option);
      });
    }
  }

  function renderResults() {
    const route = AppState.selectedRoute;
    if (!route) return;

    resultsEls.routeTitle.textContent = route.name;

    // Filter by bus query if present
    const filtered = AppState.busQuery
      ? route.buses.filter(b => b.busNumber.toLowerCase().includes(AppState.busQuery.toLowerCase()))
      : route.buses.slice();

    // Sort by soonest arrival first
    filtered.sort((a, b) => a.arrivalMins - b.arrivalMins);

    resultsEls.busList.innerHTML = '';
    filtered.forEach(bus => {
      const li = document.createElement('li');
      li.className = 'bus-row';
      li.innerHTML = `
        <div class="bus-meta">
          <span class="bus-number">${bus.busNumber}</span>
          <button class="icon-button btn-info" data-bus="${bus.busNumber}" aria-label="Bus ${bus.busNumber} details">i</button>
          ${formatDelayPill(bus.delayMins)}
        </div>
        <div class="row-right">
          <div class="arrival">
            ${bus.arrivalMins} min
            <small>at ${formatAbsoluteTimeFromNow(bus.arrivalMins)}</small>
          </div>
        </div>
      `;
      resultsEls.busList.appendChild(li);
    });

    // Update top-right panel with the next bus
    const next = filtered[0];
    if (next) {
      resultsEls.panel.busNumber.textContent = next.busNumber;
      resultsEls.panel.arrivalTime.textContent = `${formatAbsoluteTimeFromNow(next.arrivalMins)} (${next.arrivalMins} min)`;
      resultsEls.panel.delay.textContent = next.delayMins > 0 ? `+${next.delayMins} min` : 'On time';
    } else {
      resultsEls.panel.busNumber.textContent = '—';
      resultsEls.panel.arrivalTime.textContent = '—';
      resultsEls.panel.delay.textContent = '—';
    }

    // Wire info buttons
    resultsEls.busList.querySelectorAll('.btn-info').forEach(btn => {
      btn.addEventListener('click', () => {
        const busNum = btn.getAttribute('data-bus');
        const bus = route.buses.find(b => b.busNumber === busNum);
        if (bus) openDetailsModal(route, bus);
      });
    });
  }

  function openDetailsModal(route, bus) {
    modalEls.title.textContent = `Bus ${bus.busNumber} details`;
    modalEls.content.innerHTML = `
      <div class="kv"><div class="k">Route</div><div class="v">${route.name}</div></div>
      <div class="kv"><div class="k">Bus number</div><div class="v">${bus.busNumber}</div></div>
      <div class="kv"><div class="k">Driver</div><div class="v">${bus.driver}</div></div>
      <div class="kv"><div class="k">Plate</div><div class="v">${bus.plate}</div></div>
      <div class="kv"><div class="k">Capacity</div><div class="v">${bus.capacity}</div></div>
      <div class="kv"><div class="k">Occupancy</div><div class="v">${bus.occupancy}</div></div>
      <div class="kv"><div class="k">Last stop</div><div class="v">${bus.lastStop}</div></div>
      <div class="kv"><div class="k">Arrival</div><div class="v">${formatAbsoluteTimeFromNow(bus.arrivalMins)} (${bus.arrivalMins} min)</div></div>
      <div class="kv"><div class="k">Delay</div><div class="v">${bus.delayMins > 0 ? '+' + bus.delayMins + ' min' : 'On time'}</div></div>
    `;
    modalEls.overlay.hidden = false;
  }

  function closeDetailsModal() {
    modalEls.overlay.hidden = true;
  }

  function initEvents() {
    buttons.getStarted.addEventListener('click', () => {
      navigateTo('select');
    });

    buttons.backFromSelect.addEventListener('click', () => {
      navigateTo('launch');
    });

    buttons.backFromResults.addEventListener('click', () => {
      navigateTo('select');
    });

    inputs.routeSelect.addEventListener('change', () => {
      buttons.search.disabled = inputs.routeSelect.value === '';
    });

    inputs.busSearch.addEventListener('input', () => {
      AppState.busQuery = inputs.busSearch.value.trim();
    });

    buttons.search.addEventListener('click', () => {
      AppState.selectedRouteId = inputs.routeSelect.value || null;
      navigateTo('results');
      renderResults();
    });

    modalEls.overlay.addEventListener('click', (e) => {
      if (e.target === modalEls.overlay) closeDetailsModal();
    });
    modalEls.close.addEventListener('click', closeDetailsModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalEls.overlay.hidden) closeDetailsModal();
    });
  }

  function init() {
    renderRoutes();
    initEvents();
  }

  init();
})();