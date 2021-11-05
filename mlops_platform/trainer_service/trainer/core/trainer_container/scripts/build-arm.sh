
cp -R ../../configs/* ./trainer/configs/

docker build --target arm64 -t trainer-container:latest -f Dockerfile.arm .
