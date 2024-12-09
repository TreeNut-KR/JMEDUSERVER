## Stage 1
FROM node:18-alpine AS builder

# dependencies
RUN apk add --no-cache git openssh

# git clone & build script
COPY . /temp
WORKDIR /temp
RUN /bin/sh /temp/setup.sh

## Stage 2
FROM node:18-alpine

COPY --from=builder /temp/source /app

WORKDIR /app

EXPOSE 5005

ENV PORT=5005

CMD ["npm", "run", "start"]