from typing import Dict, List, Optional, Any
import logging
import numpy as np
import pandas as pd
from pydantic import BaseModel, ValidationError
from sklearn.preprocessing import StandardScaler
from tensorflow import keras
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from src.connectors.solana.transaction_parser import SolanaTransactionParser
from src.models.llm.openai_wrapper import OpenAIEmbeddingClient
from src.utils.logging.structured_logger import StructuredLogger
from src.connectors.storage.postgres_client import PostgresClient
from src.core.schemas.response_models import TokenAnalysisResult, RiskAssessment

class TokenAnalysisConfig(BaseModel):
    embedding_dim: int = 768
    risk_threshold: float = 0.85
    max_transaction_depth: int = 5
    llm_temperature: float = 0.3
    model_version: str = "v2.1.0"

class TokenAnalyzer:
    """Main class for performing deep analysis of Solana infrastructure tokens"""
    
    def __init__(self, config: TokenAnalysisConfig, db_client: PostgresClient):
        self.config = config
        self.db_client = db_client
        self.logger = StructuredLogger(__name__)
        self.scaler = self._load_scaler()
        self.llm_client = OpenAIEmbeddingClient()
        self.transaction_parser = SolanaTransactionParser()
        self.risk_model = self._load_risk_model()
        self.sentiment_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst2")
        self.sentiment_model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst2")

    def _load_risk_model(self) -> keras.Model:
        """Load pre-trained risk assessment model from serialized weights"""
        model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(self.config.embedding_dim,)),
            keras.layers.Dropout(0.4),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        model.load_weights(f"models/weights/classifier/token_classifier_{self.config.model_version}.h5")
        return model

    async def analyze_token(self, token_address: str) -> TokenAnalysisResult:
        """Main analysis pipeline for a Solana token"""
        try:
            transactions = await self.transaction_parser.get_token_transactions(token_address)
            embeddings = await self._generate_embeddings(transactions)
            risk_score = self._calculate_risk_score(embeddings)
            sentiment = self._analyze_market_sentiment(transactions)
            anomalies = self._detect_anomalies(embeddings)
            
            return TokenAnalysisResult(
                token_address=token_address,
                risk_assessment=RiskAssessment(
                    score=risk_score,
                    category="high" if risk_score > self.config.risk_threshold else "medium",
                    indicators=[indicator.dict() for indicator in anomalies]
                ),
                sentiment_score=sentiment,
                transaction_metadata=transactions[:self.config.max_transaction_depth]
            )
        except Exception as e:
            self.logger.error("Analysis failed", error=str(e), token=token_address)
            raise

    def _calculate_risk_score(self, embeddings: np.ndarray) -> float:
        """Calculate risk score using trained ML model"""
        scaled_data = self.scaler.transform(embeddings)
        return float(self.risk_model.predict(scaled_data, verbose=0).mean())

    async def _generate_embeddings(self, transactions: List[Dict]) -> np.ndarray:
        """Generate multi-modal embeddings for transactions"""
        text_data = [self._create_llm_prompt(tx) for tx in transactions]
        return await self.llm_client.batch_embed(text_data)

    def _analyze_market_sentiment(self, transactions: List[Dict]) -> float:
        """Perform sentiment analysis on transaction memos"""
        memos = [tx.get('memo', '') for tx in transactions]
        inputs = self.sentiment_tokenizer(memos, padding=True, truncation=True, return_tensors="pt")
        outputs = self.sentiment_model(**inputs)
        return torch.nn.functional.softmax(outputs.logits, dim=-1)[:, 1].mean().item()

    def _detect_anomalies(self, embeddings: np.ndarray) -> List[Dict]:
        """Detect anomalous patterns using statistical methods"""
        mahalanobis = self._calculate_mahalanobis(embeddings)
        threshold = np.percentile(mahalanobis, 95)
        return [{"index": i, "score": float(s)} for i, s in enumerate(mahalanobis) if s > threshold]

    def _create_llm_prompt(self, transaction: Dict) -> str:
        """Create structured prompt for LLM embedding generation"""
        return f"""
        Solana Transaction Analysis:
        - Block: {transaction['block']}
        - Participants: {transaction['signers']}
        - Value: {transaction['value']} SOL
        - Metadata: {transaction.get('metadata', '')}
        """

    @staticmethod
    def _load_scaler() -> StandardScaler:
        scaler = StandardScaler()
        scaler.mean_ = np.load("models/weights/classifier/scaler_mean.npy")
        scaler.scale_ = np.load("models/weights/classifier/scaler_scale.npy")
        return scaler
