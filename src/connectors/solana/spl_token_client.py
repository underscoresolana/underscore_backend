from typing import Dict, Optional
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient

class SPLTokenClient:
    """Client for interacting with SPL token contracts"""
    
    def __init__(self, rpc_client: AsyncClient):
        self.client = rpc_client
        
    async def get_token_metadata(self, mint_address: str) -> Dict:
        """Fetch metadata for SPL token"""
        mint_pubkey = Pubkey.from_string(mint_address)
        return await self.client.get_account_info_json_parsed(mint_pubkey)
