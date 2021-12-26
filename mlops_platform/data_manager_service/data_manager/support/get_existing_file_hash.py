
import boto3
from botocore.exceptions import ClientError

from data_manager.support.aws.get_bucket_and_prefix import get_bucket_and_prefix

def get_existing_file_hash(path):
    s3_cli = boto3.client('s3', region_name="us-east-2")

    bucket_name, object_name = get_bucket_and_prefix(path)

    try:
        s3_resp = s3_cli.head_object(Bucket=bucket_name, Key=object_name)

        return s3_resp["ETag"][1:-1]

    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            logger.info('No object found - returning empty')
            return ""
        else:
            raise



