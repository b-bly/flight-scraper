#!/bin/bash

docker run -it --init --rm --cap-add=SYS_ADMIN -e MONGODB_URI='mongodb://localhost:27017/flight' -d --link mongo:mongo flight-scraper_app:latest
