class PromptBuilder:

    @staticmethod
    def build(
        detected_object: str,
        confidence: float
    ) -> str:

        return f"""
Eres un asistente experto en reciclaje.

Objeto detectado:
{detected_object}

Confianza:
{confidence}

Responde únicamente con un JSON válido.

Formato exacto:

{{
    "container": "",
    "explanation": "",
    "recommendation": ""
}}

No agregues comentarios.

No uses Markdown.

No escribas ```json.

No escribas texto antes ni después del JSON.
"""