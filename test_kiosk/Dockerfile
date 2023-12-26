# Node.js 이미지를 가져옵니다.
FROM node:14

# 앱 디렉터리를 작업 디렉터리로 설정
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 추가
COPY . .

# 앱이 3000번 포트에서 실행됨
EXPOSE 3000

# 앱 시작
CMD [ "npm", "start" ]