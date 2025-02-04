import ray
from ray.util.queue import Queue

@ray.remote
class InferenceWorker:
    def __init__(self, model):
        self.model = model
        
    def predict(self, data):
        return self.model.predict(data)

class InferenceCluster:
    def __init__(self, num_workers: int):
        self.queue = Queue()
        self.workers = [InferenceWorker.remote() for _ in range(num_workers)]
