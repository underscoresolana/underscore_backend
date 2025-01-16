from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    token_address: str = Field(..., min_length=32, max_length=44)
    detailed_report: bool = True
    refresh_cache: bool = False

class SolanaRPCRequest(BaseModel):
    method: str
    params: list
