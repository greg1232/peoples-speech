FROM tensorflow/tensorflow:2.6.0 as x86

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip --no-cache-dir install -r requirements.txt

COPY . /app

RUN chmod a+x /app/scripts/run.sh
ENTRYPOINT ["/app/scripts/run.sh"]
