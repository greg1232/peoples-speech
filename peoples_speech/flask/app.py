
import peoples_speech

from flask import Flask, request
from flask_cors import CORS #comment this on deployment
import json
import os

app = Flask(__name__)
CORS(app) #comment this on deployment

import logging

logger = logging.getLogger(__name__)

@app.route('/peoples_speech/upload', methods=['GET', 'POST'])
def upload():
    logger.debug("Uploading audio data from: " + str(request.json))
    peoples_speech.upload(request.json["dataset_path"])
    return { "status" : "ok" }

@app.route('/peoples_speech/export', methods=['GET', 'POST'])
def export():
    logger.debug("Exporting data with view: " + str(request.json))
    path = peoples_speech.export(request.json["view"], request.json["images"])
    return { "path" : path}

@app.route('/peoples_speech/autosplit', methods=['GET', 'POST'])
def autosplit():
    logger.debug("Splitting data with view: " + str(request.json))
    peoples_speech.autosplit(request.json["view"])
    return { "status" : "ok"}

@app.route('/peoples_speech/get_view', methods=['GET', 'POST'])
def get_view():
    logger.debug("Getting view of images: " + str(request.json))
    view = peoples_speech.get_view(request.json["view"])
    return { "images" : view["images"]}

@app.route('/peoples_speech/train', methods=['GET', 'POST'])
def train():
    logger.debug("Training new model: " + str(request.json))
    model = peoples_speech.train(request.json)
    return { "model" : model}

@app.route('/peoples_speech/get_training_jobs', methods=['GET', 'POST'])
def get_training_jobs():
    logger.debug("Getting training jobs...")
    jobs = peoples_speech.get_training_jobs()
    return { "jobs" : jobs }

@app.route('/peoples_speech/get_exported_datasets', methods=['GET', 'POST'])
def get_exported_datasets():
    logger.debug("Getting exported datasets...")
    datasets = peoples_speech.get_exported_datasets()
    return { "datasets" : datasets }

if __name__ == '__main__':
    peoples_speech.create_config()
    app.run(host='0.0.0.0')

