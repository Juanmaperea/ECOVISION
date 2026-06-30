from app.schemas.detection import DetectionResponse, VisionDetection


def build_recommendation(detection: VisionDetection) -> DetectionResponse:
    if detection.confidence < 0.5:
        return DetectionResponse(
            object_name=detection.object_name,
            confidence=detection.confidence,
            recommended_bin="verificación manual",
            explanation="La confianza de la detección es baja, por lo que no se recomienda clasificar automáticamente.",
            tips=["Mejora la iluminación.", "Acerca el residuo a la cámara.", "Evita fondos con muchos objetos."],
            warning="La recomendación debe ser verificada por el usuario.",
        )

    return DetectionResponse(
        object_name=detection.object_name,
        confidence=detection.confidence,
        recommended_bin="reciclable",
        explanation="El objeto detectado parece pertenecer a una categoría potencialmente aprovechable.",
        tips=["Limpia el residuo antes de depositarlo.", "Verifica las reglas locales de separación."],
    )
