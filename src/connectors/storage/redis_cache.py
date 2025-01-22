import aioredis

class RedisCache:
    def __init__(self, url: str, ttl: int):
