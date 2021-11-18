FROM python:3.9 as base

WORKDIR /app/deploy_service
COPY ./requirements.txt /app/deploy_service/requirements.txt
RUN pip install -r requirements.txt

COPY . /app/deploy_service
WORKDIR /app/deploy_service

# Developement target
FROM base as development

RUN chmod a+x /app/deploy_service/scripts/start-dev.sh

ENTRYPOINT ["/app/deploy_service/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/deploy_service/scripts/start-staging.sh

ENTRYPOINT ["/app/deploy_service/scripts/start-staging.sh"]


