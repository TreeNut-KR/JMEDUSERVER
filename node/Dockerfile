FROM node:18-alpine

ENV TZ=Asia/Seoul

WORKDIR /app

COPY package*.json ./

COPY ./sources ./

COPY .env ./

RUN npm install mysql

RUN npm install dotenv

RUN npm install axios

RUN npm install node-schedule

RUN npm install cookie-parser

ENTRYPOINT [ "node", "main.js"]