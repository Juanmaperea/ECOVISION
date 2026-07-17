import { useEffect, useRef } from 'react'
import { analyzeFrame } from '../api/analysis'
import { isRecognizedWaste } from '../utils/wasteTaxonomy'

// Umbral de confianza usado SOLO para elegir qué mensaje mostrar en la
// interfaz cuando el backend descarta una detección (ver más abajo). El
// filtro real que decide si se llama a Gemini y se guarda en el historial
// ahora vive en el backend (app/modules/analysis/service.py,
// CONFIDENCE_THRESHOLD = 0.60). Este valor se mantiene igual al del
// backend para que el mensaje sea coherente con lo que realmente pasó.
export const CONFIDENCE_THRESHOLD = 0.6

// Orquesta el ciclo de análisis llamando directamente al endpoint
// combinado del backend en cada fotograma:
//   1. capturar fotograma
//   2. POST /analysis (app/modules/analysis/service.py): YOLOv8 + filtro de
//      confianza/clase + Gemini + guardado en /history, todo del lado del
//      backend en una sola llamada.
//
// Antes este hook hacía un pre-chequeo contra /visual-processing/detect
// para decidir si valía la pena llamar a /analysis, porque el backend no
// filtraba nada. Ahora ese filtro (confianza mínima + clase de residuo
// reconocida) se implementó directamente en app/modules/analysis/service.py,
// que expone el resultado en el campo `is_valid_detection` de la respuesta.
// Por eso el pre-chequeo ya no es necesario: se llama /analysis una sola
// vez por fotograma y se interpreta `is_valid_detection` para decidir si
// hubo una recomendación real o no.
//
// Incluye un guard de "in-flight" para no acumular peticiones si el
// backend responde más lento que el intervalo configurado (HU-02 / HU-18).
export function useDetectionLoop({ active, intervalMs, captureFrameBlob, onResult }) {
  const inFlightRef = useRef(false)

  useEffect(() => {
    if (!active) return undefined

    const tick = async () => {
      if (inFlightRef.current) return
      inFlightRef.current = true

      try {
        const blob = await captureFrameBlob()
        if (!blob) return

        const analysis = await analyzeFrame(blob)

        if (!analysis.ok) {
          onResult({ type: 'error', stage: 'analysis', error: analysis.error })
          return
        }

        const { detected_object: detectedObject, confidence, is_valid_detection: isValidDetection } = analysis.data

        if (!isValidDetection) {
          const isUnknown = !detectedObject || detectedObject.toLowerCase() === 'unknown'
          const isLowConfidence = !isUnknown && confidence < CONFIDENCE_THRESHOLD
          const isNotWaste = !isUnknown && !isLowConfidence && !isRecognizedWaste(detectedObject)
          const reason = isUnknown ? 'unknown' : isLowConfidence ? 'low_confidence' : isNotWaste ? 'not_waste' : 'low_confidence'
          onResult({ type: 'inconclusive', reason, detectedObject, confidence, elapsedMs: analysis.elapsedMs })
          return
        }

        onResult({
          type: 'detection',
          detectedObject,
          confidence,
          elapsedMs: analysis.elapsedMs,
          recommendation: analysis.data,
          recommendationError: null,
        })
      } catch {
        onResult({ type: 'error', stage: 'unknown', error: { message: 'Ocurrió un error inesperado durante el análisis.' } })
      } finally {
        inFlightRef.current = false
      }
    }

    const id = setInterval(tick, intervalMs)
    tick()

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, intervalMs])
}
