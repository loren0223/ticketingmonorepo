FROM node:12-alpine

ARG DEPLOY_ENV

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "${DEPLOY_ENV:-dev}"]