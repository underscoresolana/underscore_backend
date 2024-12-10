from transformers import Trainer, TrainingArguments

class LLMTrainer:
    def __init__(self, model, dataset):
        self.trainer = Trainer(
            model=model,
            args=TrainingArguments(
                output_dir="./results",
                num_train_epochs=3,
                per_device_train_batch_size=16
            ),
            train_dataset=dataset
        )
        
    def train(self):
        self.trainer.train()
