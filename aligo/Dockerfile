FROM python:3.12-bullseye
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

EXPOSE 5100

COPY ./sources /src
# db_env의 .env 파일을 /src/.env로 복사
COPY ./sources/db_env/.env /src/db_env/.env
# data_env의 .env 파일을 /src/data_env/.env로 복사
COPY ./sources/data_env/.env /src/data_env/.env
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["python", "/src/server.py"]

# 소스 코드 복사
COPY . .

# 어플리케이션 실행
CMD ["uvicorn", "Py.api.complexed_chart:app", "--host", "0.0.0.0", "--port", "8100"]

# 이미지 생성 명령어
# docker build -f Dockerfile -t python .
#

# 컨테이너 생성 명령어
#docker run -p 5100:5100 python