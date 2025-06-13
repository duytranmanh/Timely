import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

function TimelyApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Add more routes later like:
        <Route path="/activities" element={<ActivityHistory />} />
        */}
      </Routes>
    </>
  )
}

export default TimelyApp
