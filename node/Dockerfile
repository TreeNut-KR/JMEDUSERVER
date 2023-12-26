FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY index.js ./

COPY .env ./

RUN npm install dotenv

ENTRYPOINT [ "node", "index.js"]