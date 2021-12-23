#! /bin/bash

# Safely execute this bash script
# e exit on first failure
# u unset variables are errors
# f disable globbing on *
# pipefail | produces a failure code if any stage fails
set -euf -o pipefail

# Get the directory of this script
LOCAL_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Locate google credentials
export GOOGLE_APPLICATION_CREDENTIALS=${HOME}/.aws/google-cloud-credentials.json

# export flask
export FLASK_APP=$LOCAL_DIRECTORY/../data_manager/flask/app.py

# Start the dev environment
PYTHONPATH=$LOCAL_DIRECTORY/.. python $FLASK_APP

