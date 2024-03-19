FROM node:18-alpine

WORKDIR /app

COPY ./sources/package.json ./sources/package-lock.json /app/

RUN npm install

RUN npm install axios

RUN npm install express

COPY ./sources /app

EXPOSE 5004

CMD ["node", "index.js"]