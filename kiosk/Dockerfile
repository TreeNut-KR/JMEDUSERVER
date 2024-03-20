FROM node:18-alpine

WORKDIR /app

COPY ./sources/package.json ./sources/package-lock.json /app/

RUN npm install

COPY ./sources /app

EXPOSE 5004

CMD ["node", "index.js"]