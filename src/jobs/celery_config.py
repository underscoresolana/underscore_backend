from celery import Celery
from kombu.serialization import register
from src.utils.logging.structured_logger import StructuredLogger
import json
import os

logger = StructuredLogger(__name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

def custom_serializer(obj):
    return json.dumps(obj, cls=JSONEncoder).encode('utf-8')

def custom_deserializer(obj):
    return json.loads(obj.decode('utf-8'))

register('custom_json', custom_serializer, custom_deserializer, 
         content_type='application/x-custom_json',
         content_encoding='utf-8')

app = Celery(
    'under_score',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://redis:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://redis:6379/1'),
    include=['src.jobs.background_tasks'],
    task_serializer='custom_json',
    result_serializer='custom_json',
    accept_content=['custom_json'],
    broker_connection_retry_on_startup=True
)

app.conf.update(
    task_routes={
        'analyze_token_task': {'queue': 'analysis'},
        'train_model_task': {'queue': 'training'}
    },
    worker_prefetch_multiplier=4,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_compression='zstd',
    broker_pool_limit=32
)
