#! /bin/bash

# Safely execute this bash script
# e exit on first failure
# u unset variables are errors
# f disable globbing on *
# pipefail | produces a failure code if any stage fails
set -euf -o pipefail

# Get the directory of this script
LOCAL_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Setup the react dev environment
REACT_DEV_ENVIRONMENT=$LOCAL_DIRECTORY/../
cd $REACT_DEV_ENVIRONMENT
COLOR=1 npm start
