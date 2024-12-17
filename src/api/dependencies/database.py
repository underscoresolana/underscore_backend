from fastapi import Depends
from src.connectors.storage.postgres_client import PostgresClient

async def get_db() -> PostgresClient:
    """Database dependency injection"""
    db = PostgresClient(os.getenv("POSTGRES_URL"))
    await db.connect()
    return db
