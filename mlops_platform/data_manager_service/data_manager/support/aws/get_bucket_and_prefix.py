
from urllib.parse import urlparse

def get_bucket_and_prefix(path):
    result = urlparse(path, allow_fragments=False)

    return result.netloc, result.path.lstrip("/")
