# Build Stage
FROM node:22-alpine AS build

ADD git@github.com:TreeNut-KR/jmedu-admin.git /temp/source

COPY .env* /temp/source

WORKDIR /temp/source

RUN npm install 

RUN npm run build

# Production Image
FROM node:22-alpine

ENV TZ=Asia/Seoul

COPY --from=build /temp/source /app

WORKDIR /app

EXPOSE 5005

ENV PORT=5005

CMD ["npm", "run", "start"]