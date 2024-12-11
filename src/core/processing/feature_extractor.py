import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from src.connectors.solana.transaction_parser import SolanaTransactionParser

class AdvancedFeatureGenerator:
    """Generates complex features from raw transaction data"""
    
    def __init__(self, degree: int = 2):
        self.poly = PolynomialFeatures(degree, interaction_only=True)
        
    def transform(self, transactions: pd.DataFrame) -> np.ndarray:
        base_features = transactions[['value', 'block', 'signer_count']]
        poly_features = self.poly.fit_transform(base_features)
        time_features = self._extract_time_features(transactions['timestamp'])
        return np.hstack([poly_features, time_features])
        
    def _extract_time_features(self, timestamps: pd.Series) -> np.ndarray:
        dt = pd.to_datetime(timestamps, unit='s')
        return np.column_stack([
            dt.dt.hour,
            dt.dt.dayofweek,
            dt.dt.is_month_start.astype(int)
        ])
