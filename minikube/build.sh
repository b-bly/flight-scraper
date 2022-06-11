#!/bin/bash

if test -f ../.env ; then
  source ../.env
fi

npm run clean:logs
npm run clean

echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker pull "${DOCKER_USERNAME}/flight-scraper:latest" || true
docker build --cache-from "${DOCKER_USERNAME}/flight-scraper:latest" -t "${DOCKER_USERNAME}/flight-scraper:latest" ..
docker push "${DOCKER_USERNAME}/flight-scraper:latest"
