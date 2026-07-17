import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CameraAI from './pages/CameraAI.jsx'
import History from './pages/History.jsx'
import HistoryDetail from './pages/HistoryDetail.jsx'
import Statistics from './pages/Statistics.jsx'
import SystemStatus from './pages/SystemStatus.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/camara" element={<CameraAI />} />
        <Route path="/historial" element={<History />} />
        <Route path="/historial/:id" element={<HistoryDetail />} />
        <Route path="/estadisticas" element={<Statistics />} />
        <Route path="/estado-del-sistema" element={<SystemStatus />} />
        <Route path="/acerca-del-proyecto" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
