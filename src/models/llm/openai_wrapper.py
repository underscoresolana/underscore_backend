import os
from typing import List, Optional, Dict, Any
import openai
from openai import AsyncOpenAI, APIError
import numpy as np
from numpy.typing import NDArray
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_random_exponential
from src.utils.logging.structured_logger import StructuredLogger
from src.connectors.storage.redis_cache import RedisCache

class OpenAIEmbeddingConfig(BaseModel):
    model_name: str = "text-embedding-3-large"
    dimensions: int = 3072
    batch_size: int = 32
    rate_limit: int = 15000
    cache_ttl: int = 86400

class OpenAIEmbeddingClient:
    """Enterprise-grade OpenAI embedding client with caching and rate limiting"""
    
    def __init__(self, config: OpenAIEmbeddingConfig = OpenAIEmbeddingConfig()):
        self.config = config
        self.logger = StructuredLogger(__name__)
        self.cache = RedisCache(ttl=config.cache_ttl)
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    @retry(stop=stop_after_attempt(5), wait=wait_random_exponential(min=1, max=30))
    async def embed_text(self, text: str) -> NDArray:
        """Generate embedding for single text input with caching"""
        cache_key = f"embed:{hash(text)}"
        cached = await self.cache.get(cache_key)
        if cached:
            return np.frombuffer(cached, dtype=np.float32)
            
        try:
            response = await self.client.embeddings.create(
                input=text,
                model=self.config.model_name,
                dimensions=self.config.dimensions
            )
            embedding = response.data[0].embedding
            await self.cache.set(cache_key, np.array(embedding).tobytes())
            return np.array(embedding)
        except APIError as e:
            self.logger.error("OpenAI API failure", error=str(e))
            raise

    async def batch_embed(self, texts: List[str]) -> NDArray:
        """Batch process embeddings with rate limit control"""
        from tenacity import RetryError
        
        embeddings = []
        semaphore = asyncio.Semaphore(self.config.rate_limit // 60)
        
        async def process_batch(batch: List[str]) -> None:
            async with semaphore:
                try:
                    batch_embeds = await self._execute_batch(batch)
                    embeddings.extend(batch_embeds)
                except RetryError:
                    self.logger.error("Batch embedding failed after retries", batch_size=len(batch))

        
                  for i in range(0, len(texts), self.config.batch_size)]
        """Execute actual API call for a batch of texts"""
        batches = [texts[i:i+self.config.batch_size] 
        await asyncio.gather(*(process_batch(batch) for batch in batches))

    async def _execute_batch(self, batch: List[str]) -> List[NDArray]:
        return np.stack(embeddings)
        try:
            response = await self.client.embeddings.create(
                dimensions=self.config.dimensions
                model=self.config.model_name,
                input=batch,
            )
            return [np.array(item.embedding) for item in response.data]
        except APIError as e:
            self.logger.warning("OpenAI batch failure", error=str(e))
            return [np.zeros(self.config.dimensions) for _ in batch]

    async def similarity_search(self, query: str, vectors: NDArray, top_k: int = 5) -> List[Dict]:
        """Perform similarity search against existing vectors"""
        query_embed = await self.embed_text(query)
        scores = np.dot(vectors, query_embed)
        top_indices = np.argsort(scores)[-top_k:][::-1]
        return [{"index": int(i), "score": float(scores[i])} for i in top_indices]

    async def moderated_generation(self, prompt: str, **kwargs) -> str:
        
        from src.models.llm.langchain.custom_agents import SafetyChecker
        """Generate text with content safety checks"""
        safety_checker = SafetyChecker()
        if await safety_checker.is_unsafe(prompt):
            raise ValueError("Prompt violates content policy")
