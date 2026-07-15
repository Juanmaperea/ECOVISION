import { useMemo } from 'react'
import { useHistory } from '../context/HistoryContext.jsx'
import { ALL_CATEGORIES, CATEGORY_COLORS } from '../utils/wasteTaxonomy'
import { dayKey, shortDay } from '../utils/format'

const CO2_KG_PER_ITEM = 0.08 // estimación simplificada para el indicador de impacto
const RECYCLABLE_KG_PER_ITEM = 0.12

export function useMetrics(days = 14) {
  const { records } = useHistory()

  return useMemo(() => {
    const total = records.length
    const validRecords = records.filter((r) => r.category !== 'Sin clasificar')

    const avgConfidence = total
      ? records.reduce((sum, r) => sum + (r.confidence ?? 0), 0) / total
      : 0

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const detectionsToday = records.filter((r) => new Date(r.createdAt) >= startOfToday).length

    const categoryCounts = ALL_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
    records.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1
    })

    const categoryData = Object.entries(categoryCounts)
      .filter(([, count]) => count > 0 || total === 0)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] }))

    const topCategoryEntry = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
    const topCategory = topCategoryEntry && topCategoryEntry[1] > 0 ? topCategoryEntry[0] : '—'
    const topCategoryShare = total && topCategoryEntry ? topCategoryEntry[1] / total : 0

    // Serie de detecciones por día (últimos `days` días)
    const today = new Date()
    const dayBuckets = []
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      dayBuckets.push(dayKey(d))
    }
    const countsByDay = dayBuckets.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    records.forEach((r) => {
      const key = dayKey(r.createdAt)
      if (key in countsByDay) countsByDay[key] += 1
    })
    const dailySeries = dayBuckets.map((key) => ({ day: shortDay(key), value: countsByDay[key] }))

    // El backend (GET /history) no persiste el tiempo de inferencia todavía
    // (ver schemas/history.py), así que este promedio solo cuenta con datos
    // de detecciones hechas en la sesión actual (Cámara IA los adjunta en
    // memoria vía rememberLiveExtras). Con el historial recién cargado será
    // null hasta que se realice al menos una detección en vivo.
    const inferenceTimes = records.map((r) => r.inferenceMs).filter((v) => typeof v === 'number')
    const avgInferenceMs = inferenceTimes.length
      ? inferenceTimes.reduce((a, b) => a + b, 0) / inferenceTimes.length
      : null

    // Todo registro persistido en /history pasó por una recomendación
    // exitosa (useDetectionLoop solo llama a POST /history después de
    // recibir una respuesta válida de /recommendation), por eso equivale al
    // total de registros con texto de recomendación.
    const recommendationsGenerated = records.filter((r) => Boolean(r.recommendation)).length

    return {
      total,
      avgConfidence,
      detectionsToday,
      topCategory,
      topCategoryShare,
      categoryData,
      dailySeries,
      avgInferenceMs,
      recommendationsGenerated,
      co2SavedKg: validRecords.length * CO2_KG_PER_ITEM,
      recycledKg: validRecords.length * RECYCLABLE_KG_PER_ITEM,
      recent: records.slice(0, 6),
    }
  }, [records, days])
}
