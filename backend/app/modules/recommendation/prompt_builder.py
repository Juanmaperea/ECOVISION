class PromptBuilder:

    @staticmethod
    def build(
        detected_object: str,
        confidence: float
    ) -> str:

        return f"""
Eres un asistente experto en reciclaje en Colombia.

Objeto detectado:
{detected_object}

Confianza:
{confidence}

Debes clasificar el residuo usando ÚNICAMENTE el código de colores oficial
de Colombia (Resolución 2184 de 2019 del Ministerio de Ambiente, vigente
desde 2021), que define solamente tres categorías. El campo "container"
debe ser exactamente uno de estos tres valores (sin variaciones):

- "Blanco": residuos aprovechables (plástico, vidrio, metal, papel, cartón)
- "Negro": residuos no aprovechables
- "Verde": residuos orgánicos aprovechables

No uses colores de otros países (por ejemplo, no uses "amarillo" ni "azul").

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