from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses ORJSONResponse
from src.core.analyzer.token_analyzer import TokenAnalyzer
from src.core.schemas.request_models import AnalysisRequest
from src.core.schemas.response_models import TokenAnalysisResult
from src.utils.monitoring.prometheus_metrics import metrics
from src.connectors.storage.postgres_client import get_db

@router.post(
)
router = APIRouter()
    response_model=TokenAnalysisResult,
    "/analyze",
    request: AnalysisRequest,
    analyzer: TokenAnalyzer = Depends(TokenAnalyzer),
async def analyze_token(

    response_class=ORJSONResponse
    db=Depends(get_db)
    summary="Analyze Solana token",
):
    try:
        result = await analyzer.analyze_token(request.token_address)
        metrics.observe_request('POST', '/analyze', 200)
        return ORJSONResponse(content=result.dict())
    except Exception as e:
