
import aioredis
class RedisCache:
    def __init__(self, url: str, ttl: int):
        self.ttl = ttl
        self.redis = aioredis.from_url(url)
