
cp ../../configs/* deploy/configs

docker build --target development -t deploy-service:latest -f Dockerfile.arm .
