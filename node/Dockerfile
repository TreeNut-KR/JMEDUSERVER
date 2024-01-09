FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY ./sources ./

COPY .env ./

RUN npm install mysql

RUN npm install dotenv

RUN npm install axios

ENTRYPOINT [ "node", "main.js"]