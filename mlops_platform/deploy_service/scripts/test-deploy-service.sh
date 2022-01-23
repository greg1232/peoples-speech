docker run --rm -it -v $HOME/.aws:/root/.aws:ro --entrypoint /app/deploy_service/scripts/start-tests.sh deploy-service:latest $@
