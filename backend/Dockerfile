FROM node:24-slim

RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030
CMD [ "npm","run", "dev" ]