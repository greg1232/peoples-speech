
cp -R ../../../../../configs/* ./peoples_speech_tasks/configs/

docker build --target arm64 -t trainer-container:latest -f Dockerfile.arm .


