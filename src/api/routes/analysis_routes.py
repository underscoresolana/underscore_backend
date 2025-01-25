from src.core.analyzer.token_analyzer import TokenAnalyzer
router = APIRouter()

from fastapi import APIRouter, Depends, HTTPException
from src.utils.monitoring.prometheus_metrics import metrics
