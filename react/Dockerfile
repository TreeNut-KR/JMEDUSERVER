FROM node:18-alpine

ENV TZ=Asia/Seoul
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

COPY ./sources/package.json ./sources/yarn.lock /app/

RUN yarn install

RUN yarn add js-cookie

COPY ./sources /app

RUN yarn run build

RUN yarn global add serve


EXPOSE 5001

CMD ["serve", "-s", "build", "-l", "5001"]