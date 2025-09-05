import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'

function LaunchScreen() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Bus Tracker</h1>
      <p style={{ opacity: 0.8 }}>Live arrivals and delays</p>
      <button onClick={() => navigate('/select')}>Get Started</button>
    </div>
  )
}

function RouteSelectScreen() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <h2 style={{ margin: 0 }}>Select Route / Bus</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label>
          Route
          <input style={{ width: '100%', padding: 8 }} placeholder="e.g. 24, Green Line" />
        </label>
        <label>
          Stop / Location
          <input style={{ width: '100%', padding: 8 }} placeholder="e.g. Main St & 3rd" />
        </label>
      </div>
      <button onClick={() => navigate('/live')}>Search</button>
    </div>
  )
}

type Bus = {
  id: string
  number: string
  routeName: string
  arrivalMin: number
  delayMin?: number
}

const mockBuses: Bus[] = [
  { id: '1', number: '24', routeName: 'Downtown Loop', arrivalMin: 3 },
  { id: '2', number: '42A', routeName: 'Green Line', arrivalMin: 8, delayMin: 2 },
  { id: '3', number: 'B12', routeName: 'Airport Express', arrivalMin: 15 },
]

function BusInfo({ bus }: { bus: Bus }) {
  const [show, setShow] = React.useState(false)
  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Bus {bus.number}</div>
        <div style={{ opacity: 0.8 }}>{bus.routeName}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{bus.arrivalMin} min</span>
        {bus.delayMin ? (
          <span style={{ color: '#ffb703' }}>+{bus.delayMin} min</span>
        ) : (
          <span style={{ color: '#74c69d' }}>on time</span>
        )}
        <button onClick={() => setShow(true)} aria-label="More info">i</button>
        {show && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShow(false)}>
            <div style={{ background: '#222', color: 'white', padding: 16, borderRadius: 8, minWidth: 280 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginTop: 0 }}>Bus {bus.number}</h3>
              <p style={{ margin: '8px 0' }}>Route: {bus.routeName}</p>
              <p style={{ margin: '8px 0' }}>Arrival: {bus.arrivalMin} min</p>
              <p style={{ margin: '8px 0' }}>Delay: {bus.delayMin ? `${bus.delayMin} min` : 'None'}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShow(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LiveBusesScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Live Buses</h2>
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Arrivals</span>
          <span>|</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>ETA {mockBuses[0].arrivalMin} min</span>
          {mockBuses[0].delayMin ? <span style={{ color: '#ffb703' }}>+{mockBuses[0].delayMin} min</span> : <span style={{ color: '#74c69d' }}>on time</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mockBuses.map((bus) => (
          <BusInfo key={bus.id} bus={bus} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LaunchScreen />} />
      <Route path="/select" element={<RouteSelectScreen />} />
      <Route path="/live" element={<LiveBusesScreen />} />
    </Routes>
  )
}
