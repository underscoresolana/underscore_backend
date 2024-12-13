import asyncpg
from typing import List, Dict

class PostgresClient:
    """Async PostgreSQL client with connection pooling"""
    
    def __init__(self, dsn: str):
        self.pool = None
        self.dsn = dsn
        
    async def connect(self):
        self.pool = await asyncpg.create_pool(self.dsn)
        
    async def execute(self, query: str, params: tuple = None) -> List[Dict]:
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *params)
