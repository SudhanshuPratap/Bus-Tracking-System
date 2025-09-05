(function() {
  const screens = {
    launch: document.getElementById('screen-launch'),
    select: document.getElementById('screen-select'),
    arrivals: document.getElementById('screen-arrivals')
  };

  function showScreen(key) {
    Object.values(screens).forEach(el => el.classList.remove('visible'));
    screens[key].classList.add('visible');
  }

  // Mock data
  const mockData = {
    cities: ['Metropolis', 'Gotham', 'Star City'],
    routes: {
      Metropolis: ['R12 Downtown', 'R24 Riverside', 'R42 Airport'],
      Gotham: ['G7 Narrows', 'G12 Arkham', 'G29 Midtown'],
      'Star City': ['S5 Uptown', 'S18 Quays', 'S30 Central']
    },
    stops: {
      'R12 Downtown': ['Central Station', '5th Ave', 'Park Lane'],
      'R24 Riverside': ['Harbor', 'Market St', 'Old Mill'],
      'R42 Airport': ['Tech Park', 'Terminal A', 'Terminal B'],
      'G7 Narrows': ['GCPD', 'Dockyards', 'Narrows'],
      'G12 Arkham': ['Financial', 'Arkham', 'Hill'],
      'G29 Midtown': ['Queens', 'Midtown', 'Ace'],
      'S5 Uptown': ['Museum', 'Uptown', 'Lakeside'],
      'S18 Quays': ['Quays', 'Stadium', 'Foundry'],
      'S30 Central': ['Central', 'Library', 'Courthouse']
    }
  };

  function fillSelect(select, items) {
    select.innerHTML = '';
    for (const item of items) {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    }
  }

  // Elements
  const btnGetStarted = document.getElementById('btn-get-started');
  const backToLaunch = document.getElementById('back-to-launch');
  const backToSelect = document.getElementById('back-to-select');
  const citySelect = document.getElementById('select-city');
  const routeSelect = document.getElementById('select-route');
  const stopSelect = document.getElementById('select-stop');
  const btnSearch = document.getElementById('btn-search');
  const arrivalsList = document.getElementById('arrivals-list');
  const selectedContext = document.getElementById('selected-context');

  // Modal elements
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  function openModal(title, html) {
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }
  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target.hasAttribute('data-modal-close')) closeModal();
  });

  // Navigation
  btnGetStarted.addEventListener('click', () => {
    showScreen('select');
  });
  backToLaunch.addEventListener('click', () => showScreen('launch'));
  backToSelect.addEventListener('click', () => showScreen('select'));

  // Initialize selects
  fillSelect(citySelect, mockData.cities);
  fillSelect(routeSelect, mockData.routes[mockData.cities[0]]);
  fillSelect(stopSelect, mockData.stops[routeSelect.value]);

  citySelect.addEventListener('change', () => {
    const city = citySelect.value;
    fillSelect(routeSelect, mockData.routes[city]);
    fillSelect(stopSelect, mockData.stops[routeSelect.value]);
  });
  routeSelect.addEventListener('change', () => {
    fillSelect(stopSelect, mockData.stops[routeSelect.value]);
  });

  btnSearch.addEventListener('click', () => {
    const city = citySelect.value;
    const route = routeSelect.value;
    const stop = stopSelect.value;
    renderArrivals({ city, route, stop });
    showScreen('arrivals');
  });

  // Generate mock arriving buses for a route
  function generateMockArrivals(route, stop) {
    const now = Date.now();
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const buses = Array.from({ length: 5 }).map((_, index) => {
      const minutes = rand(1, 25);
      const delay = [0, 0, 2, 5][rand(0, 3)];
      return {
        busNumber: `${route.split(' ')[0]}-${100 + index}`,
        destination: route.split(' ').slice(1).join(' '),
        stop,
        etaMinutes: minutes,
        delayMinutes: delay,
        arrivalEpochMs: now + minutes * 60_000 + delay * 60_000,
        capacity: ['Low', 'Medium', 'High'][rand(0, 2)],
        operator: ['City Transit', 'Metro Bus'][rand(0, 1)],
        features: ['AC', 'Wi-Fi', 'Low-floor'].filter(() => Math.random() > 0.5)
      };
    });
    return buses.sort((a, b) => a.arrivalEpochMs - b.arrivalEpochMs);
  }

  function renderArrivals(context) {
    const { city, route, stop } = context;
    selectedContext.textContent = `${city} • ${route} • ${stop}`;
    arrivalsList.innerHTML = '';
    const arrivals = generateMockArrivals(route, stop);
    for (const item of arrivals) {
      const card = document.createElement('div');
      card.className = 'card';

      const row1 = document.createElement('div');
      row1.className = 'row';
      const left = document.createElement('div');
      left.innerHTML = `<span class="badge">${item.busNumber}</span> <strong>${item.destination}</strong>`;
      const right = document.createElement('div');
      const infoBtn = document.createElement('button');
      infoBtn.className = 'icon-btn';
      infoBtn.setAttribute('aria-label', 'Info');
      infoBtn.textContent = 'ℹ';
      infoBtn.addEventListener('click', () => showBusDetails(item));
      right.appendChild(infoBtn);
      row1.append(left, right);

      const row2 = document.createElement('div');
      row2.className = 'row muted';
      row2.textContent = `Stopping at ${item.stop}`;

      const box = document.createElement('div');
      box.className = 'arrive-box' + (item.delayMinutes ? '' : ' on-time');
      const eta = `Arrives in ${item.etaMinutes} min`;
      const delay = item.delayMinutes ? `<span class="delay">Delay ${item.delayMinutes} min</span>` : '';
      box.innerHTML = `<strong>${eta}</strong>${delay}`;

      card.append(row1, row2, box);
      arrivalsList.appendChild(card);
    }
  }

  function showBusDetails(item) {
    const html = `
      <div><strong>Bus</strong>: ${item.busNumber}</div>
      <div><strong>Destination</strong>: ${item.destination}</div>
      <div><strong>Stop</strong>: ${item.stop}</div>
      <div><strong>ETA</strong>: ${item.etaMinutes} min</div>
      <div><strong>Delay</strong>: ${item.delayMinutes ? item.delayMinutes + ' min' : 'On time'}</div>
      <div><strong>Operator</strong>: ${item.operator}</div>
      <div><strong>Capacity</strong>: ${item.capacity}</div>
      <div><strong>Features</strong>: ${item.features.length ? item.features.join(', ') : '—'}</div>
    `;
    openModal('Bus Details', html);
  }
})();

