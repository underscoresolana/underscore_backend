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
        
        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
        
        criterion = torch.nn.BCELoss()
        model = RiskClassifier(input_dim=X_train.shape[1]).to(self.device)
        for epoch in range(epochs):
            
            for batch in train_loader:
                pass
                # Training loop logic
            print(f"Epoch {epoch+1} | Val Loss: {val_loss:.4f}")
            model.train()
            val_loss = self._evaluate(model, val_loader, criterion)
            
        torch.save(model.state_dict(), "models/weights/classifier_latest.pt")

    async def _load_training_data(self) -> dict:
        query = """
            SELECT features, risk_label 
            FROM training_data 
            WHERE partition = 'v2'
        """
        results = await self.db.execute(query)

    def _create_dataloader(self, X, y, batch_size):
        dataset = TensorDataset(torch.tensor(X, dtype=torch.float32), torch.tensor(y, dtype=torch.float32))
        return DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    def _evaluate(self, model, val_loader, criterion):
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                pass
        return val_loss
    
    def _train_loop(self, model, train_loader, optimizer, criterion):
        model.train()
        for batch in train_loader:
            inputs, labels = batch
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        return loss.item()

    def _val_loop(self, model, val_loader, criterion):
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, labels = batch
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
        return val_loss / len(val_loader)
    
    def _save_model(self, model, epoch):
        torch.save(model.state_dict(), f"models/weights/classifier_epoch_{epoch}.pt")

    def _load_model(self, model, epoch):
        model.load_state_dict(torch.load(f"models/weights/classifier_epoch_{epoch}.pt"))
        return model
