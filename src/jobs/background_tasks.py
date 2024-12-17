from celery import shared_task
from src.core.analyzer.token_analyzer import TokenAnalyzer
from src.connectors.storage.postgres_client import PostgresClient
from src.utils.logging.structured_logger import StructuredLogger

logger = StructuredLogger(__name__)

@shared_task(bind=True, max_retries=3)
def analyze_token_task(self, token_address: str):
    try:
        db = PostgresClient()
        analyzer = TokenAnalyzer(config=..., db_client=db)
        result = analyzer.analyze_token(token_address)
        return result.dict()
    except Exception as e:
        logger.error("Background analysis failed", error=str(e))
        self.retry(countdown=2 ** self.request.retries)

@shared_task
def train_model_task(model_type: str, version: str):
    from models.training.pipelines.train_classifier import ModelTrainer
    db = PostgresClient()
    trainer = ModelTrainer(db)
    trainer.train(epochs=50 if model_type == "classifier" else 30)
