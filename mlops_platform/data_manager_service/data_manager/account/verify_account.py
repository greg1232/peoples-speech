from data_manager.util.config import get_config

import logging

logger = logging.getLogger(__name__)

def verify_account(account):
    logger.debug("Verifying account: " + str(account))

    config = get_config()
    is_granted = account["profileObj"]["email"] in config["account"]["whitelist"]

    return {"is_granted" : is_granted}


