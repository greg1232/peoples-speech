
import boto3
from botocore.exceptions import ClientError

from data_manager.support.aws.get_bucket_and_prefix import get_bucket_and_prefix

import logging

logger = logging.getLogger(__name__)

def get_existing_file_hash(path):
    s3_cli = boto3.client('s3', region_name="us-east-2")

    bucket_name, object_name = get_bucket_and_prefix(path)

    try:
        s3_resp = s3_cli.head_object(Bucket=bucket_name, Key=object_name)

        return s3_resp["ETag"][1:-1]

    except ClientError as ex:
        logger.debug("Got client error: " + str(ex))
        logger.debug("Error code: " + str(ex.response['Error']['Code']))
        if ex.response['Error']['Code'] == '404':
            logger.debug('No object found - returning empty')
            return ""
        else:
            raise



