# jmedu-admin Docker
아래의 내용을 참고하여 jmedu-admin 도커 이미지를 빌드하고 실행하세요.

## 준비

### 1. 환경변수 설정

[jmedu-admin](https://github.com/TreeNut-KR/jmedu-admin) 저장소의 [.env.sample](https://github.com/TreeNut-KR/jmedu-admin/blob/main/.env.example) 파일을 참고하여 환경 변수를 구성합니다.

#### 방법
- `.env` 파일을 생성하여 프로젝트 루트 디렉토리에 위치시킵니다.
- 또는 [도커 문서](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)를 참고하여 빌드시 필요한 환경 변수에 접근 가능하도록 구성합니다.

##### 예시 (.env 파일)

```dotenv
MYSQL_ROOT_HOST=database
MYSQL_ROOT_PORT=3306
MYSQL_ROOT_USER=admin
...
```

##### 디렉토리 구조
```
admin/
  ├─ .env 👈 (환경변수 파일)
  ├─ .gitignore
  ├─ Dockerfile
  ├─ README.md
  └─ setup.sh
```

### 2. SSH 키 준비

GitHub 저장소에 접근하여 소스 코드를 가져올 수 있도록 SSH 키(`id_ed25519`)를 준비하고, 프로젝트 디렉토리를 아래와 같이 구성합니다:

```
admin/
  ├─ .gitignore
  ├─ Dockerfile
  ├─ id_ed25519 👈 (SSH 키 파일)
  ├─ README.md
  └─ setup.sh
```

## 빌드

위의 준비 과정을 완료한 후, 아래 명령어를 사용하여 도커 이미지를 빌드하세요.

### Docker 명령어로 빌드

```shell
docker build -t jmedu-admin .
```

### Docker Compose로 빌드

```shell
docker-compose build
```

## 실행

이미지 빌드 후 컨테이너를 실행하려면 다음 명령어를 사용하세요:

```shell
docker run -p 5005:5005 jmedu-admin
```

또는 `docker-compose.yml` 파일이 있는 경우:

```shell
docker-compose up
```