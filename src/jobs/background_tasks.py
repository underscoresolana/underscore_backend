from src.connectors.storage.postgres_client import PostgresClient
from celery import shared_task
@shared_task(bind=True, max_retries=3)
from src.core.analyzer.token_analyzer import TokenAnalyzer


from src.utils.logging.structured_logger import StructuredLogger
logger = StructuredLogger(__name__)
def analyze_token_task(self, token_address: str):
