import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [moonPhaseFilter, setMoonPhaseFilter] = useState(0)
  const [location, setLocation] = useState('New York')
  const [currentTime, setCurrentTime] = useState('')
  const [currentMoonPhase, setCurrentMoonPhase] = useState('🌒')
  const [activeView, setActiveView] = useState('dashboard') // Add navigation state
  const [showSearchResults, setShowSearchResults] = useState(false) // Add search results state
  
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

  // Handle search button click
  const handleSearch = () => {
    setShowSearchResults(true)
    setActiveView('search')
  }

  // Handle navigation clicks
  const handleNavClick = (view) => {
    setActiveView(view)
    if (view === 'search') {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  // Render different views
  const renderDashboard = () => (
    <>
      {/* Summary Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>Location</h2>
          <p>{location}, USA</p>
        </div>
        <div className="stat-card">
          <h2>{currentTime}</h2>
          <p>Moon Rise</p>
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
          <div className="filter-section">
            <label>Moon Phase:</label>
            <input
              type="range"
              min="0" max="100" value={moonPhaseFilter}
              onChange={(e) => setMoonPhaseFilter(e.target.value)}
              className="phase-slider"
            />
            <span className="phase-label">{getPhaseName(moonPhaseFilter)}</span>
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
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
          <div className="summary-item">
            <strong>Total Records:</strong> {totalItems}
          </div>
          <div className="summary-item">
            <strong>Average Temperature:</strong> {avgTemperature} °F
          </div>
          <div className="summary-item">
            <strong>Unique Moon Phases:</strong> {uniquePhases}
          </div>
        </div>
      </div>
    </>
  )

  const renderSearch = () => (
    <div className="search-view">
      <h1>🔍 Advanced Search</h1>
      <div className="search-container">
        <div className="search-filters">
          <div className="filter-group">
            <label>Search by Date:</label>
            <input
              type="text"
              placeholder="Enter date (YYYY-MM-DD)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label>Filter by Moon Phase:</label>
            <select 
              value={getPhaseName(moonPhaseFilter)} 
              onChange={(e) => {
                const phases = ['All', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']
                const index = phases.indexOf(e.target.value)
                setMoonPhaseFilter(index * 12.5)
              }}
              className="phase-select"
            >
              <option value="All">All Phases</option>
              <option value="New Moon">New Moon</option>
              <option value="Waxing Crescent">Waxing Crescent</option>
              <option value="First Quarter">First Quarter</option>
              <option value="Waxing Gibbous">Waxing Gibbous</option>
              <option value="Full Moon">Full Moon</option>
              <option value="Waning Gibbous">Waning Gibbous</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Waning Crescent">Waning Crescent</option>
            </select>
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
        
        {showSearchResults && (
          <div className="search-results">
            <h2>Search Results ({filteredData.length} found)</h2>
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
          </div>
        )}
      </div>
    </div>
  )

  const renderAbout = () => (
    <div className="about-view">
      <h1>ℹ️ About AstroDash</h1>
      <div className="about-content">
        <div className="about-card">
          <h2>What is AstroDash?</h2>
          <p>AstroDash is a beautiful astronomical data dashboard that displays moon phases, weather data, and celestial information. It provides real-time updates and allows users to search and filter through astronomical data.</p>
        </div>
        
        <div className="about-card">
          <h2>🌙 Features</h2>
          <ul>
            <li>Real-time moon phase tracking</li>
            <li>Weather data integration</li>
            <li>Advanced search and filtering</li>
            <li>Beautiful space-themed UI</li>
            <li>Responsive design</li>
          </ul>
        </div>
        
        <div className="about-card">
          <h2>👨‍💻 Developer</h2>
          <p><strong>Name:</strong> himavant kerpurapu</p>
          <p><strong>Project:</strong> Web Development Project 5- Data Dashboard</p>
          <p><strong>Time Spent:</strong> 6 hours</p>
          <p><strong>Technologies:</strong> React, Vite, CSS3</p>
        </div>
      </div>
    </div>
  )

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
          <li 
            className={activeView === 'dashboard' ? 'active' : ''}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </li>
          <li 
            className={activeView === 'search' ? 'active' : ''}
            onClick={() => handleNavClick('search')}
          >
            <span className="nav-icon">🔍</span>
            Search
          </li>
          <li 
            className={activeView === 'about' ? 'active' : ''}
            onClick={() => handleNavClick('about')}
          >
            <span className="nav-icon">ℹ️</span>
            About
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'search' && renderSearch()}
        {activeView === 'about' && renderAbout()}
      </main>
    </div>
  )
}

export default App
