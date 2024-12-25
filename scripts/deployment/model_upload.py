import argparse
from src.connectors.storage.s3_adapter import S3Storage
from dotenv import load_dotenv

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description='Upload model weights to cloud storage')
    parser.add_argument('--model-path', required=True)
    parser.add_argument('--bucket', default="under-score-models")
    args = parser.parse_args()

    s3 = S3Storage(
        endpoint=os.getenv("AWS_S3_ENDPOINT"),
        region=os.getenv("AWS_REGION")
    )
    
    if s3.upload_model(args.bucket, "classifier/prod.pt", args.model_path):
        print("Model upload successful")
    else:
        print("Upload failed")

if __name__ == "__main__":
    main()
