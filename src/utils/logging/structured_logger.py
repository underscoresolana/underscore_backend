import logging
from pythonjsonlogger import jsonlogger

class StructuredLogger(logging.Logger):
    """JSON-structured logging with context support"""
    
    def __init__(self, name: str):
        super().__init__(name)
        handler = logging.StreamHandler()
        formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        )
        handler.setFormatter(formatter)
        self.addHandler(handler)
        
    def error(self, msg: str, **kwargs):
        super().error(msg, extra=kwargs)
