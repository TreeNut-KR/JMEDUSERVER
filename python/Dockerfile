FROM python:3.12-bullseye

COPY ./sources /src


RUN pip install requests
RUN pip install configparser


ENTRYPOINT python /src/FU/api.py

# 이미지 생성 명령어
# docker build -f Dockerfile -t python .

# 컨테이너 생성 명령어
# docker run python