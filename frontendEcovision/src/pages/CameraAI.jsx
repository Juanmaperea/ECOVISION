import { useCallback, useState } from 'react'
import { Play, Pause, Square, Camera as CameraIcon, Clock, Gauge, Sparkles, Lightbulb, CircleAlert } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'
import { ConfidenceBadge, CategoryBadge } from '../components/common/Badges.jsx'
import { EmptyState } from '../components/common/States.jsx'
import { useCameraCapture } from '../hooks/useCameraCapture.js'
import { useDetectionLoop } from '../hooks/useDetectionLoop.js'
import { useHistory } from '../context/HistoryContext.jsx'
import { getWasteInfo } from '../utils/wasteTaxonomy.js'
import { formatRelativeTime } from '../utils/format.js'

const ANALYSIS_INTERVAL_MS = 2000

export default function CameraAI() {
  const camera = useCameraCapture()
  const { records, refresh } = useHistory()
  const [current, setCurrent] = useState(null)
  const [banner, setBanner] = useState(null)

  const handleResult = useCallback(
    (result) => {
      if (result.type === 'error') {
        setBanner({ tone: 'error', message: result.error?.message ?? 'No fue posible completar el análisis.' })
        return
      }

      if (result.type === 'inconclusive') {
        const messages = {
          unknown: 'No se detectaron residuos en este fotograma.',
          low_confidence: 'La identificación no es concluyente (confianza insuficiente).',
          not_waste: `Se detectó "${result.detectedObject}", que no corresponde a un residuo reconocido por el sistema.`,
        }
        setBanner({ tone: 'info', message: messages[result.reason] ?? 'No se detectaron residuos en este fotograma.' })
        return
      }

      setBanner(null)
      const wasteInfo = getWasteInfo(result.detectedObject)

      // POST /analysis ya guardó el registro en el historial del lado del
      // backend (ver app/modules/analysis/service.py), pero su respuesta
      // (AnalysisResponse) no incluye "id" ni "created_at" del registro
      // creado. Por eso "current" no tiene id propio: para ver el detalle
      // completo con su id real hay que ir al historial una vez se
      // refresque la lista (refresh() más abajo).
      if (result.recommendation) {
        refresh()
      }

      setCurrent({
        id: null,
        detectedObject: result.detectedObject,
        label: wasteInfo.label,
        category: wasteInfo.category,
        material: wasteInfo.material,
        recyclability: wasteInfo.recyclability,
        confidence: result.confidence,
        inferenceMs: result.elapsedMs,
        container: result.recommendation?.container ?? null,
        explanation: result.recommendation?.explanation ?? null,
        recommendation: result.recommendation?.recommendation ?? null,
        recommendationError: result.recommendationError,
        createdAt: new Date().toISOString(),
      })
    },
    [refresh],
  )

  useDetectionLoop({
    active: camera.isActive,
    intervalMs: ANALYSIS_INTERVAL_MS,
    captureFrameBlob: camera.captureFrameBlob,
    onResult: handleResult,
  })

  const recent = records.slice(0, 5)

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="flex flex-col gap-4 xl:col-span-2">
        <SectionCard>
          <div className="relative aspect-video overflow-hidden rounded-xl2 bg-slate-900">
            <video ref={camera.videoRef} muted playsInline className="h-full w-full object-cover" />

            {camera.status !== 'active' && camera.status !== 'paused' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-slate-300">
                <CameraIcon size={28} />
                <p className="max-w-xs text-sm">
                  {camera.status === 'error'
                    ? camera.errorMessage
                    : camera.status === 'starting'
                      ? 'Solicitando acceso a la cámara…'
                      : 'Inicia la cámara para comenzar la detección de residuos en tiempo real.'}
                </p>
              </div>
            )}

            {(camera.isActive || camera.isPaused) && (
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                <span className={`h-1.5 w-1.5 rounded-full ${camera.isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                {camera.isActive ? 'EN VIVO' : 'EN PAUSA'}
              </span>
            )}

            {current && (camera.isActive || camera.isPaused) && (
              <span className="absolute left-3 top-11 rounded-md bg-brand-600/90 px-2 py-1 text-xs font-semibold text-white">
                {current.label} {Math.round(current.confidence * 100)}%
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!camera.isActive && !camera.isPaused ? (
                <button
                  type="button"
                  onClick={camera.start}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Play size={16} /> Iniciar cámara
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={camera.isActive ? camera.pause : camera.resume}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {camera.isActive ? <Pause size={16} /> : <Play size={16} />}
                    {camera.isActive ? 'Pausar' : 'Reanudar'}
                  </button>
                  <button
                    type="button"
                    onClick={camera.stop}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <Square size={16} /> Detener
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400">Análisis automático cada {ANALYSIS_INTERVAL_MS / 1000}s mientras la cámara esté activa.</p>
          </div>

        

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-4">
            <MiniStat icon={CameraIcon} label="Cámara" value={camera.isActive ? 'Conectada' : camera.isPaused ? 'En pausa' : 'Inactiva'} />
            <MiniStat icon={Sparkles} label="Modelo" value="YOLOv8" />
            <MiniStat icon={Clock} label="Tiempo de respuesta" value={current?.inferenceMs ? `${Math.round(current.inferenceMs)} ms` : '—'} />
            <MiniStat icon={Gauge} label="Registros en historial" value={records.length.toLocaleString('es-CO')} />
          </div>
        </SectionCard>

        <SectionCard title="Detecciones recientes">
          {recent.length === 0 ? (
            <EmptyState title="Sin detecciones todavía" message="Inicia la cámara para comenzar a registrar clasificaciones." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-slate-400">{formatRelativeTime(r.createdAt)}</span>
                    <span className="truncate font-medium text-slate-800 dark:text-slate-100">{r.label}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <CategoryBadge category={r.category} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.round(r.confidence * 100)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4">
        <SectionCard title="Objeto detectado">
          {!current ? (
            <EmptyState title="Esperando detección" message="Los resultados del análisis aparecerán aquí." />
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{current.label}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <ConfidenceBadge confidence={current.confidence} />
                  <CategoryBadge category={current.category} />
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Material</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{current.material}</dd>
                <dt className="text-slate-500 dark:text-slate-400">Contenedor recomendado</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{current.container ?? 'Pendiente'}</dd>
                <dt className="text-slate-500 dark:text-slate-400">Nivel de reciclabilidad</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{current.recyclability}</dd>
                <dt className="text-slate-500 dark:text-slate-400">Tiempo de detección</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-100">
                  {current.inferenceMs ? `${(current.inferenceMs / 1000).toFixed(2)} s` : '—'}
                </dd>
              </dl>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recomendación IA (Gemini)">
          {!current ? (
            <EmptyState title="Sin recomendación aún" />
          ) : current.recommendationError ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              No fue posible obtener la recomendación del modelo de lenguaje en este momento. {current.recommendationError.message}
            </p>
          ) : !current.explanation ? (
            <EmptyState title="Recomendación no disponible" message="El servicio de recomendaciones no respondió." />
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700 dark:text-slate-200">{current.explanation}</p>
              {current.recommendation && (
                <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
                  <Lightbulb size={16} className="mt-0.5 shrink-0" />
                  <p>{current.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        <div className="rounded-xl2 border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          Las recomendaciones son generadas por un modelo de IA y pueden requerir verificación adicional. EcoVision no almacena
          las imágenes capturadas; solo se conserva la información estructurada de cada detección.
        </div>
      </div>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-slate-400" />
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  )
}
