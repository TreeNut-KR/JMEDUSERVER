# nginx, node, mysql 스택 실행 방법
docker compose up -d

# 파이썬 이미지 생성 명령어
docker build -f Dockerfile -t python .

# 파이썬 컨테이너 생성 명령어
docker run python
docker run -p 5100:5100 python
# MySQL 접속 명령어
docker exec -it jmeduserver-mysql-1 mysql -u root -p
비밀번호 : 1234

# 첫 실행 시 MySQL 초기 설정
mysql 폴더 내의 first_setting.sql을 data 폴더에 복사하기
docker exec -it jmeduserver-mysql-1 mysql -u root -p 입력하고 비밀번호 1234 입력
source var/lib/mysql/first_setting.sql 입력