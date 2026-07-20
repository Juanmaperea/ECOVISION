// Mapea la etiqueta cruda entregada por el backend (YOLOv8 / clases COCO)
// hacia una representación amigable para la interfaz: nombre en español,
// categoría de reciclaje, material e ícono.
//
// El modelo YOLOv8 preentrenado utilizado en el MVP (yolov8n) reconoce las
// clases del dataset COCO, por lo que aún no todas las categorías mencionadas
// en el alcance del proyecto (p. ej. "lata de aluminio", "caja de cartón")
// existen como clases nativas. Este diccionario centraliza la traducción y
// puede extenderse sin tocar el resto de la aplicación cuando el equipo de
// visión incorpore un modelo entrenado con clases propias.

export const CATEGORY = {
  PLASTICO: 'Plástico',
  VIDRIO: 'Vidrio',
  METAL: 'Metal',
  PAPEL: 'Papel',
  CARTON: 'Cartón',
  ORGANICO: 'Orgánico',
  SIN_CLASIFICAR: 'Sin clasificar',
}

export const CATEGORY_COLORS = {
  [CATEGORY.PLASTICO]: '#16a34a',
  [CATEGORY.VIDRIO]: '#2563eb',
  [CATEGORY.METAL]: '#64748b',
  [CATEGORY.PAPEL]: '#7c3aed',
  [CATEGORY.CARTON]: '#c2703d',
  [CATEGORY.ORGANICO]: '#0d9488',
  [CATEGORY.SIN_CLASIFICAR]: '#94a3b8',
}

// clave: etiqueta devuelta por el backend en minúsculas
const TAXONOMY = {
  bottle: { label: 'Botella plástica', category: CATEGORY.PLASTICO, material: 'PET (Polietileno tereftalato)', recyclability: 'Alto' },
  'wine glass': { label: 'Botella / copa de vidrio', category: CATEGORY.VIDRIO, material: 'Vidrio', recyclability: 'Alto' },
  cup: { label: 'Vaso / envase', category: CATEGORY.PLASTICO, material: 'Plástico o cartón encerado', recyclability: 'Medio' },
  bowl: { label: 'Envase / tazón', category: CATEGORY.PLASTICO, material: 'Plástico o cerámica', recyclability: 'Medio' },
  vase: { label: 'Envase de vidrio', category: CATEGORY.VIDRIO, material: 'Vidrio', recyclability: 'Alto' },
  book: { label: 'Papel / cuaderno', category: CATEGORY.PAPEL, material: 'Papel', recyclability: 'Alto' },
  can: { label: 'Lata de aluminio', category: CATEGORY.METAL, material: 'Aluminio', recyclability: 'Alto' },
  tin: { label: 'Lata metálica', category: CATEGORY.METAL, material: 'Hojalata / acero', recyclability: 'Alto' },
  fork: { label: 'Cubierto metálico', category: CATEGORY.METAL, material: 'Acero inoxidable', recyclability: 'Medio' },
  knife: { label: 'Cubierto metálico', category: CATEGORY.METAL, material: 'Acero inoxidable', recyclability: 'Medio' },
  spoon: { label: 'Cubierto metálico', category: CATEGORY.METAL, material: 'Acero inoxidable', recyclability: 'Medio' },
  box: { label: 'Caja de cartón', category: CATEGORY.CARTON, material: 'Cartón corrugado', recyclability: 'Alto' },
  cardboard: { label: 'Caja de cartón', category: CATEGORY.CARTON, material: 'Cartón corrugado', recyclability: 'Alto' },
  banana: { label: 'Residuo orgánico (cáscara)', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Alto' },
  apple: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Alto' },
  orange: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Alto' },
  sandwich: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Medio' },
  broccoli: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Alto' },
  carrot: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Alto' },
  pizza: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Medio' },
  donut: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Medio' },
  cake: { label: 'Residuo orgánico', category: CATEGORY.ORGANICO, material: 'Materia orgánica', recyclability: 'Medio' },
}

// El backend carga yolov8n.pt, el modelo genérico preentrenado con las 80
// clases de COCO (incluye "person", "chair", "laptop", "tv", etc.), y
// app/modules/visual_processing/detector.py no filtra por clase: devuelve
// la primera detección tal cual la entregue YOLO. Esto significa que si el
// usuario aparece frente a la cámara, "person" puede ganarle a cualquier
// residuo real en confianza. Mientras el backend no filtre las clases
// relevantes en el propio detector, el frontend evita tratar estas clases
// como una detección de residuo válida (ver isRecognizedWaste más abajo).
export function isRecognizedWaste(rawLabel) {
  if (!rawLabel) return false
  return rawLabel.toLowerCase().trim() in TAXONOMY
}

export function getWasteInfo(rawLabel) {
  if (!rawLabel || rawLabel.toLowerCase() === 'unknown') {
    return {
      label: 'Sin detección',
      category: CATEGORY.SIN_CLASIFICAR,
      material: 'No identificado',
      recyclability: '—',
      color: CATEGORY_COLORS[CATEGORY.SIN_CLASIFICAR],
    }
  }

  const key = rawLabel.toLowerCase().trim()
  const info = TAXONOMY[key]

  if (!info) {
    return {
      label: capitalize(rawLabel),
      category: CATEGORY.SIN_CLASIFICAR,
      material: 'Material no mapeado aún',
      recyclability: 'Por definir',
      color: CATEGORY_COLORS[CATEGORY.SIN_CLASIFICAR],
    }
  }

  return { ...info, color: CATEGORY_COLORS[info.category] }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const ALL_CATEGORIES = Object.values(CATEGORY)
