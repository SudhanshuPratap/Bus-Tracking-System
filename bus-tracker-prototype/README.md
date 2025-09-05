# CityBus Tracker — Prototype

A lightweight, static web prototype for a bus tracking app with three screens:

- Launch screen
- Route/Stop selection with search
- Results listing incoming buses, featuring a top-right arrival summary box and per-bus info button

This is a static demo with simulated arrival times and delays.

## Run locally

No build step required. Serve the folder over HTTP to allow `fetch` and other browser features to work reliably.

Options:

1) Python (built-in on most systems)

```bash
cd bus-tracker-prototype
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

2) Node.js via npx

```bash
cd bus-tracker-prototype
npx --yes serve . -l 8080
```

3) Any static file server of your choice.

## Using the prototype

1. Click "Get started" on the launch screen.
2. Choose a route and stop, then tap "Search".
3. The results screen shows the incoming buses for that route/stop.
   - The top-right box shows the next arrival (bus number, ETA, delay status).
   - Each row has a small "i" button next to the bus number for more details.

## Customize

Edit `app.js` to modify sample routes, stops, buses, or the simulated ETA/delay logic. Styles are in `styles.css` and markup in `index.html`.

## Notes

- This is a prototype and not connected to real-time data sources.
- Accessibility: basic ARIA attributes are included; further enhancements may be added.

