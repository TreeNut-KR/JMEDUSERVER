FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY index.js ./

COPY .env ./

RUN npm install mysql

RUN npm install dotenv

ENTRYPOINT [ "node", "index.js"]