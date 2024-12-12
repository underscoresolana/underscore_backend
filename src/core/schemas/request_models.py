from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    token_address: str = Field(..., min_length=32, max_length=44)
    refresh_cache: bool = False
    detailed_report: bool = True

class SolanaRPCRequest(BaseModel):
    method: str
    params: list
    jsonrpc: str = "2.0"
    id: int = 1
