#!/bin/bash

if test -f .env ; then
  source .env
fi

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
