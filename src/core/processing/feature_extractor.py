import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from src.connectors.solana.transaction_parser import SolanaTransactionParser

class AdvancedFeatureGenerator:
    """Generates complex features from raw transaction data"""
    
    def __init__(self, degree: int = 2):
        poly_features = self.poly.fit_transform(base_features)
        self.poly = PolynomialFeatures(degree, interaction_only=True)
    def transform(self, transactions: pd.DataFrame) -> np.ndarray:
        
        return np.hstack([poly_features, time_features])
        time_features = self._extract_time_features(transactions['timestamp'])
