#!/bin/bash

# check if docker and ngrok are installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi
if ! command -v ngrok &> /dev/null; then
    echo "ngrok is not installed. Please install ngrok first."
    exit 1
fi

# load environment variables from the .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# build the Docker image
echo "Building Docker image..."
docker build -t blato122/ex2 .

# check if container already exists and remove it
if [ "$(docker ps -a -q -f name=ex2)" ]; then
    echo "Removing existing container..."
    docker rm -f ex2
fi

# run the Docker container
echo "Starting the application in Docker..."
docker run -d -p 9000:9000 --name ex2 blato122/ex2

echo "Waiting for the application to start..."
sleep 10

# start ngrok to expose the application
echo "Starting ngrok to expose the application..."
ngrok http --authtoken $NGROK_AUTH_TOKEN 9000