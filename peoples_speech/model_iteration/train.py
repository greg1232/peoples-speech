
from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

from peoples_speech.model_iteration.trainer_factory import TrainerFactory

from smart_open import open

import json
import os
import hashlib

import logging

logger = logging.getLogger(__name__)

def train(model_config):
    config = get_config()

    database = Database(config["model_iteration"]["job_table_name"], config)

    train_config_path = make_training_directory(config, model_config)

    record_training_job(database, train_config_path)

    trainer = TrainerFactory(config, train_config_path).create()

    trainer.launch()

    update_training_job(database, train_config_path)

    return train_config_path

def make_training_directory(config, model_config):
    md5 = hashlib.md5()
    md5.update(json.dumps(model_config).encode('utf-8'))
    md5hash = md5.hexdigest()

    path = os.path.join(config["model_iteration"]["training_path"], md5hash)

    config_path = os.path.join(path, "train.yaml")

    with open(config_path, "w") as config_file:
        json.dump(model_config, config_file)

    return config_path

def record_training_job(database, train_config_path):
    job = {
        "train_config_path" : train_config_path,
        "status" : "created"
    }
    database.insert(job)

def update_training_job(database, train_config_path):
    job = {
        "train_config_path" : train_config_path,
        "status" : "finished"
    }
    database.update(job, ("train_config_path", train_config_path) )

