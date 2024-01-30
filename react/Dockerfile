FROM node:18-alpine

WORKDIR /app

COPY ./sources/package.json ./sources/yarn.lock /app/

RUN yarn install

COPY ./sources /app

RUN yarn run build

RUN yarn global add serve


EXPOSE 5001

CMD ["serve", "-s", "build", "-l", "5001"]