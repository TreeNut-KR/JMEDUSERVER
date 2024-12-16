FROM node:18-alpine

ENV TZ=Asia/Seoul
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

COPY ./sources/package.json ./sources/yarn.lock /app/

RUN yarn install

RUN yarn add js-cookie

RUN yarn add qrcode

COPY ./sources /app

# react-scripts에 실행 권한 부여
RUN chmod +x node_modules/.bin/react-scripts

RUN yarn run build

RUN yarn global add serve


EXPOSE 5001

CMD ["serve", "-s", "build", "-l", "5001"]