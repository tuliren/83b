FROM node:18-slim

ENV IN_DOCKER=true

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-symbola \
    fonts-noto-color-emoji \
    --no-install-recommends

WORKDIR /app

RUN corepack enable

RUN addgroup --system pptruser && \
    adduser --system --home /home/pptruser --group pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app

USER pptruser

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY --chown=pptruser:pptruser . .
COPY --chown=pptruser:pptruser .yarnrc.yml .
COPY --chown=pptruser:pptruser .yarn .yarn

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
