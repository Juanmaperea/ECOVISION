from fastapi import Request
from fastapi.responses import JSONResponse


async def value_error_handler(
    request: Request,
    exc: ValueError
):

    return JSONResponse(

        status_code=400,

        content={

            "message": str(exc)

        }

    )


async def generic_error_handler(
    request: Request,
    exc: Exception
):

    return JSONResponse(

        status_code=500,

        content={

            "message": "Error interno del servidor."

        }

    )