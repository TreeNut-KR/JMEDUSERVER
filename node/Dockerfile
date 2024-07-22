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

RUN npm i request
RUN npm i multiparty
RUN npm i form-data
RUN npm i aligoapi
RUN npm i fs
RUN npm i qrcode
RUN npm i xlsx
RUN npm i util
RUN npm i express-fileupload

ENTRYPOINT [ "node", "main.js"]