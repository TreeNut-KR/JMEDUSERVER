#!/bin/bash

if [ -f "/temp/id_ed25519" ]; then
  mkdir -p /root/.ssh && chmod 700 /root/.ssh
  cp /temp/id_ed25519 /root/.ssh/
  chmod 600 /root/.ssh/id_ed25519
  ssh-keyscan github.com >> /root/.ssh/known_hosts
  git clone git@github.com:TreeNut-KR/jmedu-admin.git /temp/source
  cd /temp/source
  npm install
else
  echo -e "\033[0;31m에러: SSH 키(id_ed25519)를 찾을 수 없습니다.\033[0m"
  exit 1
fi

mv /temp/.env /temp/source/
npm run build
