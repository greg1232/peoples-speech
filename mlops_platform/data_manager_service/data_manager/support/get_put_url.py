
import boto3

from data_manager.support.aws.get_bucket_and_prefix import get_bucket_and_prefix

import logging

logger = logging.getLogger(__name__)

def get_put_url(path, expiration):

    bucket_name, object_name = get_bucket_and_prefix(path)

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3', config=boto3.session.Config(signature_version='s3v4'), region_name="us-east-2")
    response = s3_client.generate_presigned_url('put_object',
                                                Params={'Bucket': bucket_name,
                                                        'Key': object_name},
                                                ExpiresIn=expiration)

    logger.debug("Got signed URL: " + str(response))

    # The response contains the presigned URL
    return response


