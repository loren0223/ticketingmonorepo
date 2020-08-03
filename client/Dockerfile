FROM node:12-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ARG DEPLOY_ENV
ENV DEPLOY_ENV=${DEPLOY_ENV:-dev}

CMD sh run.sh