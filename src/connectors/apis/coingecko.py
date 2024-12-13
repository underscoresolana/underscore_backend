import aiohttp
from typing import Dict, List
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt

class CoinGeckoClient:
    BASE_URL = "https://api.coingecko.com/api/v3"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = aiohttp.ClientSession()
        
    @retry(stop=stop_after_attempt(3))
    async def get_token_price(self, token_id: str) -> Dict:
        url = f"{self.BASE_URL}/simple/price"
        params = {
            "ids": token_id,
            "vs_currencies": "usd",
            "x_cg_pro_api_key": self.api_key
        }
        async with self.session.get(url, params=params) as resp:
            return await resp.json()
            
    async def get_market_chart(self, token_id: str, days: int = 30) -> List[Dict]:
        url = f"{self.BASE_URL}/coins/{token_id}/market_chart"
        params = {
            "vs_currency": "usd",
            "days": days,
            "interval": "daily"
        }
        async with self.session.get(url, params=params) as resp:
            return await resp.json()
