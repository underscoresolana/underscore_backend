import boto3
from src.utils.logging.structured_logger import StructuredLogger
from typing import IO, Optional
from botocore.client import Config
from botocore.exceptions import ClientError

class S3Storage:
    """Enterprise-grade S3 storage adapter with chunked uploads"""
    
    def __init__(self, endpoint: str, region: str):
        self.logger = StructuredLogger(__name__)
        self.client = boto3.client(
            's3',
            endpoint_url=endpoint,
            region_name=region,
            config=Config(
                signature_version='s3v4',
                max_pool_connections=100
            )
        )
        
    async def upload_model(self, bucket: str, key: str, model_path: str) -> bool:
        try:
            with open(model_path, 'rb') as f:
                self.client.upload_fileobj(
                    Fileobj=f,
                    Bucket=bucket,
                    Key=key,
                    Callback=self._upload_progress
                )
            return True
        except ClientError as e:
            self.logger.error("S3 upload failed", error=str(e))
            return False

    def _upload_progress(self, bytes_transferred: int):
        self.logger.debug("Upload progress", bytes=bytes_transferred)

    async def download_model(self, bucket: str, key: str, dest_path: str) -> bool:
        try:
            with open(dest_path, 'wb') as f:
                self.client.download_fileobj(bucket, key, f)
            return True
