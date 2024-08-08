# 베이스 이미지 설정
FROM python:3.12.1

# 환경 변수 설정
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV TZ=Asia/Seoul

# 작업 디렉토리 설정
WORKDIR /app/source

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# tzdata 설치 및 시간대 설정
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# 소스 코드 및 .env 파일 복사
COPY source /app/source
COPY source/.env /app/source/.env  

# 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/source/logs
RUN chmod -R 755 /app/source/logs

# 어플리케이션 실행
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]