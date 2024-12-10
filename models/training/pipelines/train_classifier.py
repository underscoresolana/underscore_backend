import torch
import numpy as np
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from src.core.processing.feature_extractor import TransactionFeatureEngineer
from src.connectors.storage.postgres_client import PostgresClient
from src.models.token_classification.transformer_model import RiskClassifier

class ModelTrainer:
    def __init__(self, db_client: PostgresClient):
        self.db = db_client
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.feature_engineer = TransactionFeatureEngineer()
        
    async def train(self, epochs: int = 30, batch_size: int = 64):
        data = await self._load_training_data()
        X_train, X_val, y_train, y_val = train_test_split(
            data['features'], data['labels'], test_size=0.2
        )
        
        train_loader = self._create_dataloader(X_train, y_train, batch_size)
        val_loader = self._create_dataloader(X_val, y_val, batch_size)
        
        model = RiskClassifier(input_dim=X_train.shape[1]).to(self.device)
        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
        criterion = torch.nn.BCELoss()
        
        for epoch in range(epochs):
            model.train()
            for batch in train_loader:
                # Training loop logic
                pass
            
            val_loss = self._evaluate(model, val_loader, criterion)
            print(f"Epoch {epoch+1} | Val Loss: {val_loss:.4f}")
            
        torch.save(model.state_dict(), "models/weights/classifier_latest.pt")

    async def _load_training_data(self) -> dict:
        query = """
            SELECT features, risk_label 
            FROM training_data 
            WHERE partition = 'v2'
        """
        results = await self.db.execute(query)
        return {
            'features': np.stack([np.frombuffer(r['features']) for r in results]),
            'labels': np.array([r['risk_label'] for r in results])
        }
