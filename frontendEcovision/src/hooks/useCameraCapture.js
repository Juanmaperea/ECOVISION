import { useCallback, useEffect, useRef, useState } from 'react'

// Encapsula el acceso a la cámara del navegador (getUserMedia) y la captura
// de fotogramas hacia un <canvas> oculto, cubriendo las historias:
// HU-01 (iniciar captura), HU-02 (frecuencia de envío vía captureFrameBlob)
// y HU-03 (finalizar y liberar recursos).
export function useCameraCapture() {
  const videoRef = useRef(null)
  const canvasRef = useRef(document.createElement('canvas'))
  const streamRef = useRef(null)

  const [status, setStatus] = useState('idle') // idle | starting | active | paused | error | stopped
  const [errorMessage, setErrorMessage] = useState(null)

  const start = useCallback(async () => {
    setStatus('starting')
    setErrorMessage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('active')
    } catch (err) {
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
      setErrorMessage(
        denied
          ? 'No se pudo iniciar la captura: el permiso de cámara fue denegado. Habilítalo en tu navegador para continuar.'
          : 'No se pudo acceder a la cámara. Verifica que esté conectada y disponible.',
      )
      setStatus('error')
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('stopped')
  }, [])

  const pause = useCallback(() => setStatus((prev) => (prev === 'active' ? 'paused' : prev)), [])
  const resume = useCallback(() => setStatus((prev) => (prev === 'paused' ? 'active' : prev)), [])

  const captureFrameBlob = useCallback(async (quality = 0.8) => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return null

    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
    })
  }, [])

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  return {
    videoRef,
    status,
    errorMessage,
    isActive: status === 'active',
    isPaused: status === 'paused',
    start,
    stop,
    pause,
    resume,
    captureFrameBlob,
  }
}
