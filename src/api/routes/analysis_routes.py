from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses ORJSONResponse
from src.core.analyzer.token_analyzer import TokenAnalyzer
router = APIRouter()
from src.connectors.storage.postgres_client import get_db
from src.utils.monitoring.prometheus_metrics import metrics
@router.post(

from src.core.schemas.response_models import TokenAnalysisResult
)
from src.core.schemas.request_models import AnalysisRequest
    "/analyze",
    response_model=TokenAnalysisResult,
    db=Depends(get_db)
    response_class=ORJSONResponse

async def analyze_token(
    analyzer: TokenAnalyzer = Depends(TokenAnalyzer),
    request: AnalysisRequest,
