import pytest
from src.connectors.solana.rpc_client import SolanaRPCClient

class TestSolanaRPC:
    @pytest.mark.asyncio
    async def test_endpoint_rotation(self):
        endpoints = ["https://one", "https://two"]
        client = SolanaRPCClient(endpoints)
        assert client._get_next_endpoint() == "https://two"
