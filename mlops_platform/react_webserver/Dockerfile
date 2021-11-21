FROM python:3.9 as base

RUN apt-get -yq update && \
    apt-get install -yqq npm && \
    apt-get install -yqq libsndfile1

WORKDIR /app/react_webserver

COPY ./package.json /app/react_webserver/package.json

# install react
RUN npm install

# Install material-ui
RUN npm install @material-ui/core@next && \
    npm install @emotion/react && \
    npm install @emotion/styled

RUN npm install @material-ui/icons@next
RUN npm install @material-ui/styles@next
RUN npm install @material-ui/lab@next

# Install react router
RUN npm install react-router-dom

# Install environment
RUN npm install env-cmd

# Install dropzone
RUN npm install react-dropzone

# Install devexpress
RUN npm install recharts

# Install google single sign on
RUN npm install react-google-login

COPY . /app/react_webserver

# Developement target
FROM base as development

RUN chmod a+x /app/react_webserver/scripts/start-dev.sh

ENTRYPOINT ["/app/react_webserver/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/react_webserver/scripts/start-staging.sh

ENTRYPOINT ["/app/react_webserver/scripts/start-staging.sh"]


