from src.connectors.solana.transaction_parser import SolanaTransactionParser

from sklearn.preprocessing import PolynomialFeatures
import numpy as np
import pandas as pd
class AdvancedFeatureGenerator:
    """Generates complex features from raw transaction data"""
    
    def __init__(self, degree: int = 2):
