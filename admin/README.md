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

### 2. 소스 코드 준비

도커 이미지를 빌드하는 환경에 따라 아래 방법 중 하나를 선택하세요:

#### 2-1. GitHub에서 자동으로 소스 가져오기 (권장)

GitHub 저장소에 접근하기 위한 SSH 키(`id_ed25519`)를 준비하고, 프로젝트 디렉토리를 아래와 같이 구성합니다:

```
admin/
  ├─ .gitignore
  ├─ Dockerfile
  ├─ id_ed25519 👈 (SSH 키 파일)
  ├─ README.md
  └─ setup.sh
```


#### 2-2. 내부망 환경에서 수동으로 소스 준비

네트워크가 연결되지 않은 내부망 환경에서는 의존성 파일을 직접 전달해야합니다. 아래 단계를 따라 진행하세요:

1. `source` 폴더에 소스 코드를 넣습니다.
2. `npm-pack-all` 을 사용하여 전체 의존성을 패키징합니다:

```shell
cd admin/source
npx npm-pack-all --dev-deps --output dependencies.tgz
```

3. 전체 의존성을 담고 있는 파일 `dependencies.tgz` 이 생성됩니다:

```
admin/
  ├─ source/ 👈 (소스 코드)
  │   ├─ ...(files)
  │   ├─ dependencies.tgz 👈 (의존성 파일)
  │   └─ package.json
  ├─ .gitignore
  ├─ Dockerfile
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