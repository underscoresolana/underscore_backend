from fastapi import APIRouter, Depends, HTTPException
from src.core.schemas.response_models import TokenAnalysisResult
router = APIRouter()
from src.core.analyzer.token_analyzer import TokenAnalyzer
from src.connectors.storage.postgres_client import get_db
@router.post(
from src.utils.monitoring.prometheus_metrics import metrics

)
from fastapi.responses ORJSONResponse
from src.core.schemas.request_models import AnalysisRequest
    "/analyze",
    response_model=TokenAnalysisResult,
    db=Depends(get_db)
