import { useEffect, useRef } from 'react'
import { detectFrame } from '../api/detection'
import { getRecommendation } from '../api/recommendation'
import { createHistory } from '../api/history'

// Umbral mínimo de confianza para considerar una detección "concluyente" a
// nivel de interfaz (HU-06: validar confiabilidad). El backend no aplica
// este filtro por sí mismo antes de generar una recomendación, así que el
// cliente actúa como salvaguarda: solo se consulta a Gemini y solo se
// persiste en el historial cuando la detección supera este umbral,
// cumpliendo HU-06 ("solo se envían al módulo de razonamiento las
// detecciones válidas") y HU-10 ("solo se almacenan clasificaciones
// válidas").
export const CONFIDENCE_THRESHOLD = 0.4

// Orquesta el ciclo completo:
//   1. capturar fotograma
//   2. POST /visual-processing/detect        (YOLOv8)
//   3. si es concluyente -> POST /recommendation (Gemini)
//   4. si hubo recomendación -> POST /history     (persistencia)
//
// Se usa la orquestación granular en vez del endpoint combinado
// POST /analysis porque este último no aplica ningún umbral de confianza
// antes de llamar a Gemini y guardar en base de datos (ver
// backend/app/modules/analysis/service.py, rama develop): siempre
// persiste, incluso para detecciones "Unknown". Haciendo los tres pasos
// desde el frontend, el cliente controla exactamente cuándo vale la pena
// gastar una llamada a Gemini y una escritura en la base de datos.
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

        const detection = await detectFrame(blob)

        if (!detection.ok) {
          onResult({ type: 'error', stage: 'detect', error: detection.error })
          return
        }

        const { detected_object: detectedObject, confidence } = detection.data
        const isConclusive = detectedObject && detectedObject.toLowerCase() !== 'unknown' && confidence >= CONFIDENCE_THRESHOLD

        if (!isConclusive) {
          onResult({ type: 'inconclusive', detectedObject, confidence, elapsedMs: detection.elapsedMs })
          return
        }

        const recommendation = await getRecommendation({ detectedObject, confidence })

        if (!recommendation.ok) {
          onResult({
            type: 'detection',
            detectedObject,
            confidence,
            elapsedMs: detection.elapsedMs,
            recommendation: null,
            recommendationError: recommendation.error,
            historyRecord: null,
            historyError: null,
          })
          return
        }

        const historySave = await createHistory({
          detectedObject,
          confidence,
          recommendation: recommendation.data.recommendation,
          explanation: recommendation.data.explanation,
        })

        onResult({
          type: 'detection',
          detectedObject,
          confidence,
          elapsedMs: detection.elapsedMs,
          recommendation: recommendation.data,
          recommendationError: null,
          historyRecord: historySave.ok ? historySave.data : null,
          historyError: historySave.ok ? null : historySave.error,
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
