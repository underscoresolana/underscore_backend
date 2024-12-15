from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses ORJSONResponse
from src.core.analyzer.token_analyzer import TokenAnalyzer
from src.core.schemas.request_models import AnalysisRequest
from src.core.schemas.response_models import TokenAnalysisResult
from src.utils.monitoring.prometheus_metrics import metrics
from src.connectors.storage.postgres_client import get_db

router = APIRouter()

@router.post(
    "/analyze",
    response_model=TokenAnalysisResult,
    summary="Analyze Solana token",
    response_class=ORJSONResponse
)
async def analyze_token(
    request: AnalysisRequest,
    analyzer: TokenAnalyzer = Depends(TokenAnalyzer),
    db=Depends(get_db)
):
    try:
        result = await analyzer.analyze_token(request.token_address)
        metrics.observe_request('POST', '/analyze', 200)
        return ORJSONResponse(content=result.dict())
    except Exception as e:
        metrics.observe_request('POST', '/analyze', 500)
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        ) from e
