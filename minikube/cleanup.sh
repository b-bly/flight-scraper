#!/bin/bash

# /Users/other/dev-projects/flight-scraper/minikube
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
ENV_PATH=$(readlink -f $SCRIPT_DIR/../.env)

if test -f $ENV_PATH ; then
  source $ENV_PATH
fi

echo "${DOCKER_USERNAME}/flight-scraper:latest"

RUNNING_CONTAINERS=$(docker ps -q --filter="ancestor=${DOCKER_USERNAME}/flight-scraper:latest")
if [ ! -z "$RUNNING_CONTAINERS" -a "$RUNNING_CONTAINERS" != " " ]; then
  docker stop $RUNNING_CONTAINERS
fi

RUNNING_CONTAINERS=$(docker ps -q --filter="ancestor=flight-scraper_app")
if [ ! -z "$RUNNING_CONTAINERS" -a "$RUNNING_CONTAINERS" != " " ]; then
  docker stop $RUNNING_CONTAINERS
fi

RUNNING_CONTAINERS=$(docker ps -q --filter="ancestor=mongo")
if [ ! -z "$RUNNING_CONTAINERS" -a "$RUNNING_CONTAINERS" != " " ]; then
  docker stop $RUNNING_CONTAINERS
fi

STOPPED_CONTAINERS=$(docker ps -q --filter="ancestor=${DOCKER_USERNAME}/flight-scraper:latest")
if [ ! -z "$STOPPED_CONTAINERS" -a "$STOPPED_CONTAINERS" != " " ]; then
  docker rm $STOPPED_CONTAINERS
fi

STOPPED_CONTAINERS=$(docker ps -q --filter="ancestor=flight-scraper_app")
if [ ! -z "$STOPPED_CONTAINERS" -a "$STOPPED_CONTAINERS" != " " ]; then
  docker rm $STOPPED_CONTAINERS
fi

STOPPED_CONTAINERS=$(docker ps -q --filter="ancestor=mongo")
if [ ! -z "$STOPPED_CONTAINERS" -a "$STOPPED_CONTAINERS" != " " ]; then
  docker rm $STOPPED_CONTAINERS
fi

docker volume prune -f
# TODO clean logs, screenshots after they are saved as artifacts or something
