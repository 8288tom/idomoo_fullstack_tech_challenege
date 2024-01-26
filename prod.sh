#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building Docker Images without cache..."
docker-compose -f docker-compose-prod.yml build --no-cache

echo "Starting Docker Compose..."
docker-compose -f docker-compose-prod.yml up -d