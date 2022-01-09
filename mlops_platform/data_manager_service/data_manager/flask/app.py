
import data_manager

from flask import Flask, request
from flask_cors import CORS #comment this on deployment
import json
import os

app = Flask(__name__)
CORS(app) #comment this on deployment

import logging

logger = logging.getLogger(__name__)

###
## Data Browser
###
@app.route('/peoples_speech/upload', methods=['GET', 'POST'])
def upload():
    logger.debug("Uploading audio data from: " + str(request.json))
    data_manager.upload(request.json["dataset_path"])
    return { "status" : "ok" }

@app.route('/peoples_speech/set_labels', methods=['GET', 'POST'])
def set_labels():
    logger.debug("Saving new labels: " + str(request.json))
    data_manager.set_labels(request.json["view"], request.json["images"], request.json["label"])
    return { "status" : "ok"}

@app.route('/peoples_speech/export', methods=['GET', 'POST'])
def export():
    logger.debug("Exporting data with view: " + str(request.json))
    path = data_manager.export(request.json["view"], request.json["images"], request.json["name"])
    return { "path" : path}

@app.route('/peoples_speech/autosplit', methods=['GET', 'POST'])
def autosplit():
    logger.debug("Splitting data with view: " + str(request.json))
    data_manager.autosplit(request.json["view"], request.json["images"])
    return { "status" : "ok"}

@app.route('/peoples_speech/setsplit', methods=['GET', 'POST'])
def setsplit():
    logger.debug("Splitting data with view: " + str(request.json))
    data_manager.setsplit(request.json["view"], request.json["images"], request.json["type"])
    return { "status" : "ok"}

@app.route('/peoples_speech/get_view', methods=['GET', 'POST'])
def get_view():
    logger.debug("Getting view of images: " + str(request.json))
    view = data_manager.get_view(request.json["view"])
    return { "images" : view["images"]}

@app.route('/peoples_speech/get_upload_url_for_file', methods=['GET', 'POST'])
def get_upload_url_for_file():
    logger.debug("Getting upload url of file: " + str(request.json))
    url, path, md5_hash = data_manager.get_upload_url_for_file(request.json["file"])
    return { "url" : url, "path" : path, "md5_hash" : md5_hash }

@app.route('/peoples_speech/register_uploaded_audio', methods=['GET', 'POST'])
def register_uploaded_audio():
    logger.debug("Getting upload url of file: " + str(request.json))
    data_manager.register_uploaded_audio(request.json["path"])
    return { "status" : "ok"}

@app.route('/peoples_speech/get_srt_url', methods=['GET', 'POST'])
def get_srt_url():
    logger.debug("Getting transcripts as SRT file for audio: " + str(request.json))
    url = data_manager.get_srt_url(request.json["uid"])
    return { "url" : url }

###
## Transcription
###

@app.route('/peoples_speech/get_transcription_tasks', methods=['GET', 'POST'])
def get_transcription_tasks():
    logger.debug("Getting transcription tasks...")
    tasks = data_manager.get_transcription_tasks()
    return { "tasks" : tasks }

@app.route('/peoples_speech/get_transcription_utterances', methods=['GET', 'POST'])
def get_transcription_utterances():
    logger.debug("Getting transcription utterances...")
    utterances = data_manager.get_transcription_utterances(request.json["uid"])
    return { "utterances" : utterances }

@app.route('/peoples_speech/make_transcription_task', methods=['GET', 'POST'])
def make_transcription_task():
    logger.debug("Making transcription task: " + str(request.json))
    data_manager.make_transcription_task(request.json["view"], request.json["images"])
    return { "status" : "ok"}

@app.route('/peoples_speech/auto_label', methods=['GET', 'POST'])
def auto_label():
    logger.debug("Auto labeling: " + str(request.json))
    data_manager.auto_label(request.json["view"], request.json["images"])
    return { "status" : "ok"}

@app.route('/peoples_speech/auto_segment', methods=['GET', 'POST'])
def auto_segment():
    logger.debug("Auto segmenting: " + str(request.json))
    data_manager.auto_segment(request.json["view"], request.json["images"])
    return { "status" : "ok"}

@app.route('/peoples_speech/group_into_sentences', methods=['GET', 'POST'])
def group_into_sentences():
    logger.debug("Grouping into sentences: " + str(request.json))
    data_manager.group_into_sentences(request.json["view"], request.json["images"])
    return { "status" : "ok"}

@app.route('/peoples_speech/submit_transcripts', methods=['GET', 'POST'])
def submit_transcripts():
    logger.debug("Committing transcription: " + str(request.json))
    data_manager.submit_transcripts(request.json["utterances"])
    return { "status" : "ok"}

###
## Model Iteration
###

@app.route('/peoples_speech/get_exported_datasets', methods=['GET', 'POST'])
def get_exported_datasets():
    logger.debug("Getting exported datasets...")
    datasets = data_manager.get_exported_datasets()
    return { "datasets" : datasets }

@app.route('/peoples_speech/train', methods=['GET', 'POST'])
def train():
    logger.debug("Training new model: " + str(request.json))
    model = data_manager.train(request.json)
    return { "model" : model}

@app.route('/peoples_speech/get_training_jobs', methods=['GET', 'POST'])
def get_training_jobs():
    logger.debug("Getting training jobs...")
    jobs = data_manager.get_training_jobs()
    return { "jobs" : jobs }

@app.route('/peoples_speech/get_error_analysis_results', methods=['GET', 'POST'])
def get_error_analysis_results():
    logger.debug("Getting error analysis results...")
    results = data_manager.get_error_analysis_results(request.json["model_uid"])
    return { "audios" : results["audios"] }

###
## Authentication
###
@app.route('/peoples_speech/verify_account', methods=['GET', 'POST'])
def verify_account():
    logger.debug("Verfying account...")
    response = data_manager.verify_account(request.json)
    return response

if __name__ == '__main__':
    data_manager.create_config()
    app.run(host='0.0.0.0', port=5001)

