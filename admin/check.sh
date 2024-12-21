#!/bin/bash

if [ -f "/temp/id_ed25519" ]; then
  mkdir -p /root/.ssh && chmod 700 /root/.ssh
  cp /temp/id_ed25519 /root/.ssh/
  chmod 600 /root/.ssh/id_ed25519
  ssh-keyscan github.com >> /root/.ssh/known_hosts
  latest_commit_hash=$(git ls-remote git@github.com:TreeNut-KR/jmedu-admin.git refs/heads/main 2>/dev/null | awk '{print $1}')
  if [ $? -eq 0 ] && [ -n "$latest_commit_hash" ]; then
    echo "$latest_commit_hash" > /temp/latest_commit_hash.txt
  else
    echo -e "\033[0;31m에러: 최신 커밋을 가져올 수 없습니다.\033[0m"
    exit 1
  fi
else
  echo -e "\033[0;31m에러: SSH 키(id_ed25519)를 찾을 수 없습니다.\033[0m"
  exit 1
fi
