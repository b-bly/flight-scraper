# 2 stage build
# https://cloudnweb.dev/2019/09/building-a-production-ready-node-js-app-with-typescript-and-docker/
FROM node:16-slim as BUILD_IMAGE
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

FROM node:16-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
# Install Google Chrome Stable and fonts
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# puppeteer referenced example https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile

# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
WORKDIR /app

COPY support /app/support
COPY package.json /app/
#COPY local.conf /etc/fonts/local.conf

# Install deps for server.
ENV NODE_ENV=production
RUN npm i --only=production
RUN npm i puppeteer --save
RUN npx install-chrome-dependencies


# Copy from build above
COPY --from=BUILD_IMAGE /usr/dist ./dist

# Install puppeteer so it can be required by user code that gets run in
# server.js. Cache bust so we always get the latest version of puppeteer when
# building the image.
ARG CACHEBUST=1
# RUN npm i puppeteer

# from marcoseko's comment https://github.com/puppeteer/puppeteer/issues/3451
RUN echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/userns.conf

# Add pptr user.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /usr/bin/google-chrome

# Run user as non privileged.
USER pptruser

EXPOSE 8080

# ENTRYPOINT ["dumb-init", "--"]
ENTRYPOINT ["npm", "start"]