
cp -R ../../configs/* ./data_manager/configs/

docker build --target development -t data-manager-service:latest .
