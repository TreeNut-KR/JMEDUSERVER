FROM python:3.12-bullseye

EXPOSE 5100

COPY ./sources /src

RUN pip install requests
RUN pip install configparser
RUN pip install flask
RUN pip install flask_sqlalchemy
RUN pip install flask_socketio

ENTRYPOINT ["python", "/src/server.py"]
# 이미지 생성 명령어
# docker build -f Dockerfile -t python .
#

# 컨테이너 생성 명령어
#docker run -p 5100:5100 python