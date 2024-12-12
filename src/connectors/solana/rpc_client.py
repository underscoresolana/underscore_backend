import asyncio
import json
from typing import Any, Dict, List, Optional
import aiohttp
from aiohttp import ClientSession, ClientTimeout
from backoff import expo, on_exception
from tenacity import retry, stop_after_attempt, wait_exponential
from src.utils.logging.structured_logger import StructuredLogger
from src.core.schemas.request_models import SolanaRPCRequest

class SolanaRPCError(Exception):
    """Custom exception for Solana RPC failures"""

class SolanaRPCClient:
    """High-performance async client for Solana JSON-RPC endpoints"""
    
    def __init__(self, endpoints: List[str], timeout: int = 30):
        self.endpoints = endpoints
        self.timeout = ClientTimeout(total=timeout)
        self.logger = StructuredLogger(__name__)
        self._session: Optional[ClientSession] = None
        self._current_endpoint_idx = 0

    async def __aenter__(self):
        self._session = ClientSession(timeout=self.timeout)
        return self

    async def __aexit__(self, *exc_info):
        if self._session:
            await self._session.close()

    @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def call_method(self, method: str, params: list) -> Dict[str, Any]:
        """Execute JSON-RPC call with failover and retry logic"""
        request = SolanaRPCRequest(method=method, params=params, jsonrpc="2.0", id=1)
        headers = {'Content-Type': 'application/json'}
        
        for _ in range(len(self.endpoints)):
            endpoint = self._get_next_endpoint()
            try:
                async with self._session.post(
                    endpoint,
                    data=request.json(),
                    headers=headers
                ) as response:
                    if response.status != 200:
                        raise SolanaRPCError(f"HTTP {response.status}")
                        
                    result = await response.json()
                    if 'error' in result:
                        raise SolanaRPCError(result['error']['message'])
                        
                    return result
            except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                self.logger.warning("RPC call failed", endpoint=endpoint, error=str(e))
                continue
                
        raise SolanaRPCError("All endpoints failed")

    async def get_block(self, slot: int) -> Dict[str, Any]:
        """Retrieve full block information by slot number"""
        return await self.call_method("getBlock", [slot, {"encoding": "json", "transactionDetails": "full"}])

    async def get_token_accounts(self, mint: str) -> List[Dict[str, Any]]:
        """Get all token accounts for specific mint"""
        params = [
            {
                "mint": mint
            },
            {
                "encoding": "jsonParsed",
                "commitment": "finalized"
            }
        ]
        result = await self.call_method("getTokenAccountsByOwner", params)
        return result.get('result', {}).get('value', [])

    def _get_next_endpoint(self) -> str:
        """Rotate through available RPC endpoints"""
        self._current_endpoint_idx = (self._current_endpoint_idx + 1) % len(self.endpoints)
        return self.endpoints[self._current_endpoint_idx]

    @on_exception(expo, SolanaRPCError, max_tries=3)
    async def subscribe_account(self, pubkey: str) -> Any:
        """Subscribe to account updates via websocket"""
        ws_url = self.endpoints[0].replace('https', 'wss')
        async with self._session.ws_connect(ws_url) as ws:
            sub_request = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "accountSubscribe",
                "params": [pubkey, {"encoding": "base64", "commitment": "confirmed"}]
            }
            await ws.send_json(sub_request)
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    return json.loads(msg.data)
                elif msg.type == aiohttp.WSMsgType.CLOSED:
                    break
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    break
