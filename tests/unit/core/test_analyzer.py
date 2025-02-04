import pytest
from unittest.mock import AsyncMock, MagicMock, patch
import numpy as np
from src.core.analyzer.token_analyzer import TokenAnalyzer, TokenAnalysisConfig
from src.connectors.storage.postgres_client import PostgresClient
from src.core.schemas.response_models import TokenAnalysisResult

class TestTokenAnalyzer:
    @pytest.fixture
    def mock_db(self):
        return MagicMock(spec=PostgresClient)

    @pytest.fixture
    def mock_config(self):
        return TokenAnalysisConfig(
            embedding_dim=128,
            risk_threshold=0.75,
            max_transaction_depth=3
        )

    @pytest.fixture
    def analyzer(self, mock_config, mock_db):
        with patch('src.core.analyzer.token_analyzer.OpenAIEmbeddingClient') as mock_llm:
            mock_llm.return_value.batch_embed.return_value = np.random.rand(5, 128)
            return TokenAnalyzer(mock_config, mock_db)

    @pytest.mark.asyncio
    async def test_analyze_token_success(self, analyzer):
        mock_parser = AsyncMock()
        mock_parser.get_token_transactions.return_value = [
            {"block": 123, "signers": ["A", "B"], "value": 1.5, "metadata": "test"},
            {"block": 124, "signers": ["C"], "value": 2.3, "metadata": ""}
        ]
        analyzer.transaction_parser = mock_parser

        result = await analyzer.analyze_token("TEST_TOKEN_ADDRESS")
        
        assert isinstance(result, TokenAnalysisResult)
        assert result.token_address == "TEST_TOKEN_ADDRESS"
        assert 0 <= result.risk_assessment.score <= 1
        assert len(result.transaction_metadata) <= analyzer.config.max_transaction_depth

    @pytest.mark.asyncio
    async def test_risk_score_calculation(self, analyzer):
        test_embeddings = np.random.normal(size=(10, 128))
        risk_score = analyzer._calculate_risk_score(test_embeddings)
        assert 0 <= risk_score <= 1

    @pytest.mark.asyncio
    async def test_anomaly_detection(self, analyzer):
        embeddings = np.array([
            [1.0]*128,
            [2.0]*128,
            [100.0]*128  # Outlier
        ])
        anomalies = analyzer._detect_anomalies(embeddings)
        assert len(anomalies) == 1
        assert anomalies[0]['index'] == 2

    def test_config_validation(self):
        with pytest.raises(ValidationError):
            TokenAnalysisConfig(risk_threshold=1.5)

    @pytest.mark.asyncio
    async def test_error_handling(self, analyzer):
        mock_parser = AsyncMock()
        mock_parser.get_token_transactions.side_effect = Exception("RPC failure")
        analyzer.transaction_parser = mock_parser

        with pytest.raises(Exception):
            await analyzer.analyze_token("BAD_TOKEN")

    @pytest.mark.asyncio
    async def test_sentiment_analysis(self, analyzer):
        transactions = [{"memo": "Great project!"}, {"memo": "Hate this token"}]
        sentiment = analyzer._analyze_market_sentiment(transactions)
        assert 0 <= sentiment <= 1
