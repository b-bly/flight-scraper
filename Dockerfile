# 2 stage build
# https://cloudnweb.dev/2019/09/building-a-production-ready-node-js-app-with-typescript-and-docker/
FROM node:16-slim as BUILD_IMAGE
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

# https://dev.to/docker/unable-to-locate-package-google-chrome-stable-b62
FROM node:16
# https://stackoverflow.com/questions/71452265/how-to-run-puppeteer-on-a-docker-container-on-a-macos-apple-silicon-m1-arm64-hos
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

# non-root user that comes with `node` images.
USER node

WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN npm install


COPY --from=BUILD_IMAGE --chown=node /usr/dist ./dist
RUN mkdir -p screenshots

# ENTRYPOINT ["dumb-init", "--"]
ENTRYPOINT ["npm", "start"]