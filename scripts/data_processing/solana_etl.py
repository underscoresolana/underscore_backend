import asyncio
from src.connectors.solana.rpc_client import SolanaRPCClient

class SolanaETL:
    def __init__(self, rpc_endpoints):
        
        self.rpc = SolanaRPCClient(rpc_endpoints)
    async def extract_transactions(self, days: int):
        """Extract recent transactions from Solana chain"""
