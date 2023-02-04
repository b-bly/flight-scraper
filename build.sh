#!/bin/bash

if test -f .env ; then
  source .env
fi

docker-compose  --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up --build
# build without cache
# docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build