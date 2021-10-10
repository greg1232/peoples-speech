import config
import os

import logging

logger = logging.getLogger(__name__)

global_config = None

def create_config(arguments):
    global global_config
    global_config = setup_config(arguments)

    setup_logging(global_config)

    logger.debug("Config: " + str(global_config))

    return global_config

def get_config(arguments):
    global global_config
    if global_config is None:
        create_config(arguments)
    return global_config

def setup_config(dictionary = {}):
    return config.ConfigurationSet(
        config.config_from_dict(dictionary),
        config.config_from_env(prefix="PEOPLES_SPEECH_TASKS"),
        config.config_from_yaml(config_path(), read_from_file=True),
    )

def config_path():
    home = os.path.expanduser("~")
    home_config_path = os.path.join(home, ".peoples_speech_tasks_config.yaml")
    if os.path.exists(home_config_path):
        return home_config_path

    return os.path.join(os.path.dirname(os.path.dirname(__file__)), "configs", "peoples_speech_tasks_config.yaml")

def setup_logging(arguments):

    logging_format = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"

    if arguments["verbose"]:
        logging.basicConfig(level=logging.DEBUG, format=logging_format)
    elif arguments["verbose_info"]:
        logging.basicConfig(level=logging.INFO, format=logging_format)
    else:
        logging.basicConfig(level=logging.WARNING, format=logging_format)

    root_logger = logging.getLogger()

    if arguments["verbose"]:
        root_logger.setLevel(logging.DEBUG)
    elif arguments["verbose_info"]:
        root_logger.setLevel(logging.INFO)
    else:
        root_logger.setLevel(logging.WARNING)

    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("botocore").setLevel(logging.WARNING)
    logging.getLogger("smart_open").setLevel(logging.WARNING)

