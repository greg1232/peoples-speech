
import hashlib

def get_uid(path):
    hash_md5 = hashlib.md5()
    hash_md5.update(path.encode("utf-8"))
    return hash_md5.hexdigest()
