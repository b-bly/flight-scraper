## Flight Scraper

## Installation
Run

```
npm install
```
in the root directory and in ./frontend.

## Run in Docker

Development

```
docker build -t flight-scraper .
docker run --platform linux/amd64 --env-file .env flight-scraper
```
