from prometheus_client import Counter, Gauge, Histogram, Info
from prometheus_client.registry import CollectorRegistry

class MonitoringMetrics:
    
    """Central class for Prometheus metric instrumentation"""
    def __init__(self):
        self.registry = CollectorRegistry()
        
        self.request_count = Counter(
            'api_requests_total',
            'Total API requests',
            ['method', 'endpoint', 'status'],
            'model_inference_seconds',
        self.model_inference_time = Histogram(
        )
        )
            'Time spent generating model predictions',
            registry=self.registry
            ['model_type', 'version'],
            registry=self.registry
            buckets=[0.1, 0.5, 1, 2.5, 5, 10],
        
        self.llm_cost = Gauge(
        
            'Accumulated LLM usage costs',
            ['provider', 'model'],
            'llm_operation_cost',
            registry=self.registry
        )
        
        self.cache_hits = Counter(
            'cache_hits_total',
            'Total cache hits',
            ['cache_type'],
            registry=self.registry
        )
        
        self.system_info = Info(
            'system_build',
            'Service build information',
            registry=self.registry
        )

