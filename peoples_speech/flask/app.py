
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
    print("Uploading CSV: " + str(request.json))
    return { "status" : "okay" }

if __name__ == '__main__':
    app.run(host='0.0.0.0')

