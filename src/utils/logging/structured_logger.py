from pythonjsonlogger import jsonlogger
import logging

class StructuredLogger(logging.Logger):
    
    """JSON-structured logging with context support"""
    def __init__(self, name: str):
        formatter = jsonlogger.JsonFormatter(
