#! /bin/bash

# Safely execute this bash script
# e exit on first failure
# u unset variables are errors
# f disable globbing on *
# pipefail | produces a failure code if any stage fails
set -euf -o pipefail

# Get the directory of this script
LOCAL_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Set python environment
PYTHONPATH="$LOCAL_DIRECTORY/../peoples_speech/flask"
export PYTHONPATH

# export flask
export FLASK_APP=$LOCAL_DIRECTORY/../peoples_speech/flask/app.py

# kill background tasks on script exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Setup the react dev environment
REACT_DEV_ENVIRONMENT=$LOCAL_DIRECTORY/../peoples_speech/react/speech-data-manager

# Start the dev environment
PYTHONPATH=$LOCAL_DIRECTORY/.. python $FLASK_APP &

cd $REACT_DEV_ENVIRONMENT
COLOR=1 npm run start:staging | cat &
wait
