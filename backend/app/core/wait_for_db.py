import time

from sqlalchemy import text

from app.core.database import engine


def wait_database():

    while True:

        try:

            with engine.connect() as conn:

                conn.execute(text("SELECT 1"))

            print("Base de datos lista.")

            break

        except Exception:

            print("Esperando PostgreSQL...")

            time.sleep(2)