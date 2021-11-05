FROM python:3.9 as base

WORKDIR /app/trainer_service
COPY ./requirements.txt /app/trainer_service/requirements.txt
RUN pip install -r requirements.txt

COPY . /app/trainer_service
WORKDIR /app/trainer_service

# Developement target
FROM base as development

RUN chmod a+x /app/trainer_service/scripts/start-dev.sh

ENTRYPOINT ["/app/trainer_service/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/trainer_service/scripts/start-staging.sh

ENTRYPOINT ["/app/trainer_service/scripts/start-staging.sh"]


