
import logging
from pythonjsonlogger import jsonlogger
class StructuredLogger(logging.Logger):
    
    """JSON-structured logging with context support"""
    def __init__(self, name: str):
        formatter = jsonlogger.JsonFormatter(
        )
        handler.setFormatter(formatter)
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        handler = logging.StreamHandler()
        super().__init__(name)
