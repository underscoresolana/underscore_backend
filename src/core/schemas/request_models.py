from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    detailed_report: bool = True
    refresh_cache: bool = False
    token_address: str = Field(..., min_length=32, max_length=44)

class SolanaRPCRequest(BaseModel):
