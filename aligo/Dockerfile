FROM python:3.12-bullseye
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

EXPOSE 5100

COPY ./sources /src
COPY .env /src/.env

RUN pip install --no-cache-dir fastapi uvicorn mysql-connector-python python-dotenv requests

ENTRYPOINT ["python", "/src/server.py"]
# 이미지 생성 명령어
# docker build -f Dockerfile -t python .
#

# 컨테이너 생성 명령어
#docker run -p 5100:5100 python