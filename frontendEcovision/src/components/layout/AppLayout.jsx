import { useState } from 'react'
import { Outlet, useLocation, matchPath } from 'react-router-dom'
import { X } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const PAGE_META = [
  { path: '/', title: 'Dashboard', subtitle: 'Resumen general del rendimiento del sistema' },
  { path: '/camara', title: 'Cámara IA en tiempo real', subtitle: 'Detección automática de residuos con YOLOv8' },
  { path: '/historial', title: 'Historial de detecciones', subtitle: 'Consulta todas las detecciones realizadas' },
  { path: '/historial/:id', title: 'Detalle de detección', subtitle: 'Información completa de la detección seleccionada' },
  { path: '/estadisticas', title: 'Estadísticas', subtitle: 'Análisis detallado del rendimiento del sistema' },
  { path: '/estado-del-sistema', title: 'Estado del sistema', subtitle: 'Monitorea en tiempo real los servicios' },
  { path: '/acerca-del-proyecto', title: 'Acerca del proyecto', subtitle: 'Información sobre EcoVision' },
]

function useCurrentPageMeta() {
  const location = useLocation()
  const match = PAGE_META.find((item) => matchPath({ path: item.path, end: true }, location.pathname))
  return match ?? { title: 'EcoVision', subtitle: '' }
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { title, subtitle } = useCurrentPageMeta()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div className="relative">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-white p-1 text-slate-600 shadow dark:bg-slate-800 dark:text-slate-200"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar title={title} subtitle={subtitle} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
