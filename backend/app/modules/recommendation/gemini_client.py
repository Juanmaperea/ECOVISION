from google import genai

from app.core.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class GeminiClient:

    @staticmethod
    def ask(prompt: str) -> str:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        return response.text
    
    @staticmethod
    def ask_with_metadata(prompt: str):
        return client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
