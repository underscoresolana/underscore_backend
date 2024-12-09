import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer
from src.connectors.storage.postgres_client import PostgresClient

class TransactionFeatureEngineer(BaseEstimator, TransformerMixin):
    """Feature engineering pipeline for raw Solana transactions"""
    
    def __init__(self, n_components: int = 50, text_features: bool = True):
        self.text_pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000)),
            ('pca', PCA(n_components=n_components))
        ])
        self.text_features = text_features
        
    def fit(self, X: pd.DataFrame, y=None):
        if self.text_features:
            self.text_pipeline.fit(X['metadata'].fillna(''))
        return self
    
    def transform(self, X: pd.DataFrame) -> np.ndarray:
        numeric_features = X[['value', 'block', 'signer_count']].values
        if not self.text_features:
            return numeric_features
            
        text_features = self.text_pipeline.transform(X['metadata'].fillna(''))
        return np.hstack([numeric_features, text_features])

class FeatureStore:
    """Feature store for caching processed transaction features"""
    
    def __init__(self, db_client: PostgresClient):
        self.db = db_client
        self.cache = {}
        
    async def get_features(self, token_address: str) -> np.ndarray:
        cached = self.cache.get(token_address)
        if cached:
            return cached
            
        query = """
            SELECT features FROM token_features 
            WHERE address = %s AND version = %s
        """
        result = await self.db.execute(query, (token_address, "v2"))
        if result:
            return np.frombuffer(result[0]['features'])
            
        raise ValueError("Features not found in store")

    async def update_features(self, token_address: str, features: np.ndarray):
        self.cache[token_address] = features
        query = """
            INSERT INTO token_features (address, version, features)
            VALUES (%s, %s, %s)
            ON CONFLICT (address) DO UPDATE SET
                features = EXCLUDED.features,
                updated_at = NOW()
        """
        await self.db.execute(
            query, 
            (token_address, "v2", features.tobytes())
        )
