FROM node:24-slim as build


RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

CMD [ "npm","run","dev" ]