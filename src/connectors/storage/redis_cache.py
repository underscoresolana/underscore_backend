import aioredis

class RedisCache:
    def __init__(self, url: str, ttl: int):
        self.redis = aioredis.from_url(url)
        self.ttl = ttl
        
    async def get(self, key: str):
        return await self.redis.get(key)
        
    async def set(self, key: str, value: Any):
        await self.redis.set(key, value, ex=self.ttl)
