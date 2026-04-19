import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import RatingsReviews from './pages/RatingsReviews'
import Workers from './pages/Workers'
import Clients from './pages/Clients'
import Bookings from './pages/Bookings'

import { useState, useEffect, createContext, useContext } from 'react'

export const ThemeContext = createContext()

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="workers" element={<Workers />} />
          <Route path="clients" element={<Clients />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="ratings-reviews" element={<RatingsReviews />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeContext.Provider>
  )
}

export default App
