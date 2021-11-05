
cp -R ../../configs/* ./trainer/configs/

docker build --target x86 -t trainer-container:latest .
