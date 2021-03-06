
from data_manager.support.database import Database
from data_manager.util.config import get_config

from data_manager.trainer.trainer_factory import TrainerFactory

from smart_open import open

import json
import yaml
import os
import hashlib
import time

import logging

logger = logging.getLogger(__name__)

def train(model_config):
    config = get_config()

    database = Database(config["model_iteration"]["job_table_name"], config)

    train_config_path, training_config = make_training_directory(config, model_config)

    job = record_training_job(database, train_config_path, training_config)

    trainer = TrainerFactory(config, train_config_path).create()

    trainer.launch()

    update_training_job(database, train_config_path, training_config, job)

    return train_config_path

def make_training_directory(config, model_config):
    uid = make_uid(model_config)

    path = os.path.join(config["model_iteration"]["training_path"], uid)

    config_path = os.path.join(path, "train.yaml")

    training_config = make_training_config(model_config, config, path)

    with open(config_path, "w") as config_file:
        yaml.dump(training_config, config_file)

    return config_path, training_config

def record_training_job(database, train_config_path, training_config):
    job = {
        "name" : training_config["model_iteration"]["trainer"]["dataset"]["name"],
        "uid" : training_config["model_iteration"]["trainer"]["uid"],
        "train_config_path" : train_config_path,
        "results_path" : training_config["model_iteration"]["trainer"]["model"]["results_path"],
        "save_path" : training_config["model_iteration"]["trainer"]["model"]["save_path"],
        "status" : "created",
        "start_time": int( time.time() ),
        "end_time" : "still running...",
        "accuracy" : "still running..."
    }
    database.insert(job)

    return job

def update_training_job(database, train_config_path, training_config, job):
    logger.debug("Loading results from " + training_config["model_iteration"]["trainer"]["model"]["results_path"])
    try:
        with open(training_config["model_iteration"]["trainer"]["model"]["results_path"]) as results_file:
            results = json.load(results_file)

        job["accuracy"] = results["accuracy"]
        job["status"] = "finished"
    except:
        job["status"] = "failed"

    job["end_time"] = int( time.time() )

    database.update(job, ("train_config_path", train_config_path) )

def make_training_config(model_config, config, path):
    base_config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
        "configs", "peoples_speech.yaml")

    with open(base_config_path) as base_config_file:
        training_config = yaml.safe_load(base_config_file)

        training_model_config = training_config["model_iteration"]["trainer"]

        training_model_config["dataset"]["path"] = model_config["dataset"]["path"]
        training_model_config["dataset"]["name"] = model_config["dataset"]["name"]

        training_model_config["model"]["save_path"] = os.path.join(path, "best")
        training_model_config["model"]["results_path"] = os.path.join(path, "results.json")

        training_model_config["uid"] = make_uid(training_config)

        logger.debug("Training config is: " + str(training_config))

    return training_config

def make_uid(training_config):
    md5 = hashlib.md5()
    md5.update(json.dumps(training_config).encode('utf-8'))
    md5hash = md5.hexdigest()

    return md5hash

