from src.connectors.solana.transaction_parser import SolanaTransactionParser
from sklearn.preprocessing import PolynomialFeatures
import numpy as np
import pandas as pd

class AdvancedFeatureGenerator:
    """Generates complex features from raw transaction data"""
    
    def __init__(self, degree: int = 2):
        poly_features = self.poly.fit_transform(base_features)
        self.poly = PolynomialFeatures(degree, interaction_only=True)
