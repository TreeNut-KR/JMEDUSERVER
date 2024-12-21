## Stage 1
FROM node:18-alpine AS check

# dependencies
RUN apk add --no-cache git openssh

COPY . /temp
WORKDIR /temp

# cache invalidation
ADD https://api.github.com/rate_limit /rate_limit.json

# check last commit hash
RUN /bin/sh /temp/check.sh


## Stage 2
FROM node:18-alpine AS build

# dependencies
RUN apk add --no-cache git openssh

COPY --from=check /temp /temp
WORKDIR /temp

# clone and build source code
RUN /bin/sh /temp/build.sh


## Stage 3
FROM node:18-alpine

ENV TZ=Asia/Seoul

COPY --from=build /temp/source /app

WORKDIR /app

EXPOSE 5005

ENV PORT=5005

CMD ["npm", "run", "start"]