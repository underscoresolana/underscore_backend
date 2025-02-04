from datadog import initialize, statsd
from contextlib import asynccontextmanager
import os

class DatadogMetrics:
    def __init__(self):
        initialize(
            api_key=os.getenv("DD_API_KEY"),
            app_key=os.getenv("DD_APP_KEY")
        )
        
    @asynccontextmanager
    async def trace(self, name: str):
        with statsd.timed(f'under_score.{name}'):
            yield
            
    def increment(self, metric: str, tags: list = None):
        statsd.increment(metric, tags=tags)

    def record_histogram(self, metric: str, value: float, tags: list = None):
