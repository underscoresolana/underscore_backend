
from transformers import Trainer, TrainingArguments
class LLMTrainer:
    def __init__(self, model, dataset):
        self.trainer = Trainer(
            args=TrainingArguments(
            ),
                output_dir="./results",
                per_device_train_batch_size=16
                num_train_epochs=3,
            train_dataset=dataset
            model=model,
        )
