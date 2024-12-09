#!/bin/bash

if [ -d "/temp/source" ]; then
  # 내부망 환경
  echo "소스 폴더 감지"
  cd /temp/source
  if [ -f "/temp/source/dependencies.tgz" ]; then
    # npm-pack-all
    echo "의존성을 설치합니다."
    npm install dependencies.tgz
  else
    echo -e "\033[0;31m에러: 의존성 파일을 찾을 수 없습니다.\033[0m"
    exit 1
  fi
else
  if [ -f "/temp/id_ed25519" ]; then
    mkdir -p /root/.ssh && chmod 700 /root/.ssh
    mv /temp/id_ed25519 /root/.ssh/
    ssh-keyscan github.com >> /root/.ssh/known_hosts
    git clone git@github.com:TreeNut-KR/jmedu-admin.git /temp/source
    cd /temp/source
    npm install
  else
    echo -e "\033[0;31m에러: SSH 키(id_ed25519)를 찾을 수 없습니다.\033[0m"
    exit 1
  fi
fi

mv /temp/.env /temp/source/
npm run build
