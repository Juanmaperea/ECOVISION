ALLOWED_TYPES = [

    "image/jpeg",

    "image/png"

]

MAX_SIZE = 5 * 1024 * 1024


class ImageValidator:

    @staticmethod
    def validate(
        content_type: str,
        size: int
    ):

        if content_type not in ALLOWED_TYPES:

            raise ValueError(
                "Formato de imagen no soportado."
            )

        if size > MAX_SIZE:

            raise ValueError(
                "La imagen supera el tamaño permitido."
            )