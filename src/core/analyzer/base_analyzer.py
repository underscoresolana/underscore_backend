from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAnalyzer(ABC):
    """Abstract base class for analysis components"""
    
    @abstractmethod
    async def initialize(self):
        """Load required resources"""
        
    @abstractmethod
    async def analyze(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main analysis method"""
        
    @abstractmethod
    def validate_input(self, input_data: Dict) -> bool:
        """Validate input schema"""
