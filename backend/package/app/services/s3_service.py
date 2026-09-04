import boto3
from app.config import settings

s3_client = boto3.client("s3", region_name=settings.aws_region)

def upload_file_to_s3(file, key: str) -> None:
    s3_client.upload_fileobj(file, settings.s3_bucket_name, key)