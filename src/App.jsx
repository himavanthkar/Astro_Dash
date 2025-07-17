import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [moonPhaseFilter, setMoonPhaseFilter] = useState(0)
  const [location, setLocation] = useState('New York')
  const [currentTime, setCurrentTime] = useState('')
  const [currentMoonPhase, setCurrentMoonPhase] = useState('🌒')  // Mock data for demonstration (since we need API key for real weather API)
  const mockWeatherData = [
    { date: '2025-01-16', temperature: 76, time: '23:37', phase: 'Waxing Crescent', phaseIcon: '🌒' },
    { date: '2025-01-17', temperature: 76, time: '00:02', phase: 'Waxing Crescent', phaseIcon: '🌒' },
    { date: '2025-01-18', temperature: 74, time: '00:09', phase: 'First Quarter', phaseIcon: '🌓' },
    { date: '2025-01-19', temperature: 78, time: '01:04', phase: 'Waxing Gibbous', phaseIcon: '🌔' },
    { date: '2025-01-20', temperature: 79, time: '01:42', phase: 'Waxing Gibbous', phaseIcon: '🌔' },
    { date: '2025-01-21', temperature: 81, time: '02:18', phase: 'Full Moon', phaseIcon: '🌕' },
    { date: '2025-01-22', temperature: 80, time: '03:19', phase: 'Waning Gibbous', phaseIcon: '🌖' },
    { date: '2025-01-23', temperature: 77, time: '04:21', phase: 'Waning Gibbous', phaseIcon: '🌖' },
    { date: '2025-01-24', temperature: 75, time: '05:29', phase: 'Last Quarter', phaseIcon: '🌗' },
    { date: '2025-01-25', temperature: 72, time: '06:58', phase: 'Waning Crescent', phaseIcon: '🌘' },
    { date: '2025-01-26', temperature: 70, time: '08:39', phase: 'Waning Crescent', phaseIcon: '🌘' },
    { date: '2025-01-27', temperature: 68, time: '10:07', phase: 'New Moon', phaseIcon: '🌑' },
    { date: '2025-01-28', temperature: 69, time: '12:25', phase: 'Waxing Crescent', phaseIcon: '🌒' },
    { date: '2025-01-29', temperature: 73, time: '14:35', phase: 'Waxing Crescent', phaseIcon: '🌒' },
    { date: '2025-01-30', temperature: 76, time: '16:58', phase: 'Waxing Crescent', phaseIcon: '🌒' }
  ]

  useEffect(() => {
    // Simulate API call with mock data
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWeatherData(mockWeatherData)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set current moon phase based on today's data
    const today = new Date().toISOString().split('T')[0]
    const todayData = weatherData.find(item => item.date === today)
    if (todayData) {
      setCurrentMoonPhase(todayData.phaseIcon)
    }
  }, [weatherData])

  // Filter data based on search term and moon phase
  const filteredData = weatherData.filter(item => {
    const matchesSearch = item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.phase.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPhase = moonPhaseFilter === 0 || item.phase.includes(getPhaseName(moonPhaseFilter))
    return matchesSearch && matchesPhase
  })

  const getPhaseName = (value) => {
    const phases = ['All', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']
    return phases[Math.floor(value / 12.5)] || 'All'
  }

  // Calculate summary statistics
  const totalItems = weatherData.length
  const avgTemperature = weatherData.length > 0 ? (weatherData.reduce((sum, item) => sum + item.temperature, 0) / weatherData.length).toFixed(1) : 0
  const uniquePhases = [...new Set(weatherData.map(item => item.phase))].length

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading astronomical data...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Navigation Sidebar */}
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">🌌</span>
          <h1>AstroDash</h1>
        </div>
        <ul className="nav-links">
          <li className="active">
            <span className="nav-icon">🏠</span>
            Dashboard
          </li>
          <li>
            <span className="nav-icon">🔍</span>
            Search
          </li>
          <li>
            <span className="nav-icon">ℹ️</span>
            About
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Summary Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h2>Location</h2>
            <p>{location}, USA</p>
          </div>
          <div className="stat-card">
            <h2>{currentTime}</h2>           <p>Moon Rise</p>
          </div>
          <div className="stat-card">
            <span className="moon-icon">{currentMoonPhase}</span>
            <p>Moon Phase</p>
          </div>
        </div>

        {/* Data Dashboard */}
        <div className="dashboard">
          {/* Search and Filter Section */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Enter Date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="filter-section">            <label>Moon Phase:</label>
              <input
                type="range"
                min="0" max="100" value={moonPhaseFilter}
                onChange={(e) => setMoonPhaseFilter(e.target.value)}
                className="phase-slider"
              />
              <span className="phase-label">{getPhaseName(moonPhaseFilter)}</span>
            </div>
            <button className="search-btn">Search</button>
          </div>

          {/* Data Table */}
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature</th>
                  <th>Time</th>
                  <th>Phase</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.temperature} °F</td>
                    <td>{item.time}</td>
                    <td>
                      <span className="phase-icon">{item.phaseIcon}</span>
                      {item.phase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="summary-stats">
            <div className="summary-item">           <strong>Total Records:</strong> {totalItems}
            </div>
            <div className="summary-item">           <strong>Average Temperature:</strong> {avgTemperature} °F
            </div>
            <div className="summary-item">           <strong>Unique Moon Phases:</strong> {uniquePhases}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
