<p align="center">
  
<img width="1354" alt="스크린샷 2024-05-31 오후 4 22 00" src="https://github.com/jgkim14/JMEDUSERVER/assets/48284333/361e71c7-511d-4a72-8c9a-07700149685a">

<img width="500" alt="KakaoTalk_Photo_2025-03-17-12-42-11.jpeg" src="https://github.com/user-attachments/assets/bf86154d-9a6e-4342-851b-f6f8823f420f">

</p>

# 프로젝트 구성원

| 구성원 | 업무 |
|--------|--------|
|[김준건 (jgkim14)](https://github.com/jgkim14)|프로젝트 매니저, 백엔드|
|[서정훈 (CutTheWire)](https://github.com/CutTheWire)|백엔드|
|[고범준 (udongmandu)](https://github.com/udongmandu)|프론트엔드|
|[박종운 (bel1c10ud)](https://github.com/bel1c10ud)|프론트엔드|









# 학원의 문제점 및 요구사항 분석

자녀가 학원에 잘 도착했는지 알 수 없다.

수업 도중 무단 조퇴하는 학생이 있다.

출석부 관리를 자동화 하고싶다.

수업별로 학생, 학부모에게 단체 공지를 하고싶다.

수업 일정을 관리하고 싶다. 현재 강의실 수가 부족하여 강사들과의 강의실 사용 협의가 매번 필요하다.

직원이 무단으로 학생 개인정보를 열람했을 때 증거를 남기고싶다. (법적 대응을 위한 증거 기록)

# 제공 솔루션

카카오 알림톡 및 SMS를 사용하여 학부모에게 등/하원 사실을 알린다.

수업 시작 시 키오스크를 통해 등원 처리된 학생 수를 제공한다.
- 등원 인원과 강의실에 입실한 인원과 일치하지 않으면 등원 기록을 제시하여 허워 등원처리한 학생을 적발하고, 무단 등원처리 알림톡을 전송한다.

학생 키오스크 등/하원 처리 내역 및 수업 참여 인원 보기를 제공하여 효율적인 출석부 관리 기능을 제공한다.

수업에 등록된 학생들을 검색하여 해당 수업의 수강 학생 또는 학부모에게 보강, 일정 변경 등의 공지를 한다.

직원이 학생의 정보를 열람했을 경우, 누가 언제 어떤 정보를 열람하고 수정했는지 로그를 남긴다.

수업 시간, 수강 학생 및 사용하는 강의실 호수를 입력하여 수업 일정을 등록하는 기능을 제공한다.
등록하는 시간에 이미 다른 일정에서 강의실을 사용하는 경우, 등록 실패 메세지를 띄우고, 이미 등록된 강의의 이름을 보여준다.

# 시스템 구성 다이어그램

![xx drawio](https://github.com/jgkim14/JMEDUSERVER/assets/48284333/d4065187-bc99-471a-9b7a-685607be2144)

1. 학부모에게 SMS 또는 알림톡을 전송한다.
2. 학생이 찍은 QR코드 값을 인식한다.
3. 등/하원 처리 결과를 알려준다.(등원, 하원, 중복처리, 실패)
4. 알리고 컨테이너로 QR코드 값을 전송한다.
5. 등/하원 처리 결과를 전송한다.(등원, 하원, 중복처리, 실패)
6. 관리 페이지를 전송한다.
7. 리액트 페이지를 이용하여 서버에게 요청을 보내고, 결과값을 가져온다.
8. 학부모 연락처와 등/하원 메세지를 전송한다.
9. 수신자 연락처와 사용자가 입력한 메세지를 전송한다.
10. QR코드값을 전송하고, 학생 이름을 반환받는다.
11. 사용자의 요청대로 조회/삽입/갱신/삭제를 수행한다.

Python Module Github Link : https://github.com/CutTheWire/ClassLinker


# 프로젝트 디렉토리 구조

```
JMEDUSERVER/
├── aligo/                        # 알리고(알림톡/SMS) 관련 파이썬 서버 코드
│   └── source/
│       ├── server.py             # FastAPI 메인 서버 엔트리포인트
│       └── utils/
│           └── Aligo.py          # 알리고 API 연동 및 메시지 전송 유틸
├── node/                         # Node.js 기반 학원 관리 서버
│   └── sources/
│       ├── managePlan.js         # 시간표/플랜 관리
│       ├── manageSchool.js       # 학교 관리
│       ├── manageStudent.js      # 학생 관리
│       ├── manageSubject.js      # 과목 관리
│       ├── manageTeacher.js      # 강사 관리
│       ├── checkAttend.js        # 출석 체크 및 관련 API
│       ├── db.js                 # DB 연결 설정
│       └── logger.js             # 출결/관리 로그 기록
├── react/                        # React 프론트엔드(관리자/키오스크)
│   └── sources/
│       ├── src/
│       │   ├── pages/            # 주요 페이지(교사, 관리자 등)
│       │   │   ├── teacher/
│       │   │   │   ├── manage_subject.jsx
│       │   │   │   ├── manage_schedule.jsx
│       │   │   │   ├── schedule-edit/
│       │   │   │   │   ├── PlanEdit.jsx
│       │   │   │   │   ├── planAdd.jsx
│       │   │   │   └── subject-edit/
│       │   │   │       └── subjectShow.jsx
│       │   │   └── admin/
│       │   │       └── view_log.jsx
│       │   ├── constants/
│       │   │   └── sideMenus.js  # 사이드 메뉴 구성
│       │   ├── template/
│       │   │   └── Consist.jsx   # 공통 레이아웃
│       │   └── server.js         # 서버 연동 유틸
│       └── public/
│           └── index.html        # SPA 진입점
├── kiosk/                        # 키오스크(출석용) 프론트엔드
│   └── sources/
│       ├── public/
│       │   └── index.html
│       └── index.js
├── test_kiosk/                   # 키오스크 테스트용 스크립트
│   └── kdh.py
├── admin/                        # 관리자 도커/설정 파일
│   ├── README.md
│   ├── Dockerfile
│   └── setup.sh
├── README.md                     # 프로젝트 설명서
```

# Docker 컨테이너 구성
Docker를 사용하여 각 서비스를 컨테이너화 하고, 배포 및 관리를 용이하게 한다.

NginX
- 서버의 모든 접속을 처리하고 각 서비스로의 요청을 적절하게 분배한다.

Aligo
- 사용 언어 : Python
- 기능 : 키오스크의 파이썬 모듈에서 받은 QR코드 값으로 데이터베이스에서 학생을 검색하여 학부모에게 알림을 보내고, 처리 결과를 키오스크에게 WebSocket으로 보낸다.

React
- 사용 언어 : JAVA Script
- 기능 : 키오스크 페이지 및 관리자 페이지를 제공한다. 서버와의 통신을 위한 웹페이지 배포만을 담당하며, 클라이언트에게서 데이터를 받지 않는다.

Node
- 사용 언어 : JAVA Script
- 기능 요약 : 원장 및 직원이 사용하기 위한 서버를 담당한다.
- 기능 : 로그인, 회원가입, 직원권한설정, 수업관리, 시간표관리, 학교관리 학생관리, 조건부공지, 출석인원더블체크, 직원기능접근기록

MySQL
- 모든 정보를 저장하기 위한 데이터베이스

# 데이터베이스 구성

<img width="1324" alt="스크린샷 2024-05-31 오후 3 41 02" src="https://github.com/jgkim14/JMEDUSERVER/assets/48284333/8ff22309-cb20-40d1-be28-e6697ac048b1">


school : 학교 정보

student : 학생 정보

teacher : 강사 정보

attendence_log : 키오스크에서 기록한 학생 등/하원 정보

admin_log : 강사가 학생 개인정보에 접근한 기록

teacher_attend_log : 강사 출/퇴근 기록

subject : 과목 정보

plan : 과목의 수업 시간표

student_subject : 수업에 대한 수강 대상 학생을 기록

subject_executed_attenders : 강사의 더블체크 후 수업에 참여한 학생을 기록

subject_executed : 수업이 진행되었음을 기록

permissions : 각 서버의 관리자 기능에 대한 권한 레벨 정보

serverconf : 서버 관리 설정 기록



# 서버를 구성하는 방법

```
# .env 파일 경로
JMEDUSERVER/
├── node/
│   └── .env                # Node.js 서버에서 실제로 사용되는 환경변수 파일
├── aligo/
│   └── source/
│       └── .env            # 알리고(FastAPI) 서버에서 사용하는 환경변수 파일
├── admin/
│   └── .env                # 관리자 도커/배포 환경변수 파일
├── react/
│   └── sources/
│       └── .env            # React 프론트엔드 환경변수 파일
```

```
# 최상단 .env
MYSQL_ROOT_HOST=mysql
MYSQL_ROOT_USER= # 데이터베이스 계정 이름
MYSQL_ROOT_PASSWORD= # 데이터베이스 계정 패스워드
MYSQL_DATABASE=jmedu
SESSION_SECRET= # 로그인 세션 시크릿 키
```

```
# aligo/source/.env
SMS_KEY= # 알리고 API 키
SMS_USERID= # 알리고 계정 ID
SMS_SENDER= # 알리고에 등록된 발신자 전화번호
SMS_MSG=
SMS_MSG_TYPE=SMS
SMS_TITLE=title
SMS_TESTMODE_YN=N # 테스트 모드 여부



MYSQL_ROOT_HOST=mysql
MYSQL_ROOT_USERDB_USER= # 데이터베이스 계정 이름
MYSQL_ROOT_PASSWORD= # 데이터베이스 계정 패스워드
MYSQL_DATABASE=jmedu


ALIMTALK_API_KEY= # 알리고 API 키
ALIMTALK_USERID= # 알리고 계정 ID
ALIMTALK_SENDERKEY= # 카카오 알림톡 발신자 키
ALIMTALK_SENDER= # 알림톡 발신자 전화번호

ALIMTALK_TEMPLATE_ATTEND= # 알림톡 등원 템플릿 코드
ALIMTALK_TEMPLATE_LEAVE= # 알림톡 하원 템플릿 코드
```

```
# node/.env
MYSQL_ROOT_HOST=mysql
MYSQL_ROOT_USER= # 데이터베이스 계정 이름
MYSQL_ROOT_PASSWORD= # 데이터베이스 계정 패스워드
MYSQL_DATABASE=jmedu
SESSION_SECRET= # 로그인 세션 시크릿 키
SMS_SENDER= # 알리고 SMS 발신자 전화번호
SMS_KEY= # 알리고 SMS API 키
```

```
# react/sources/.env
# GitHub에 올라가있음
REACT_APP_SERVER_URL=http://localhost # 클라이언트의 접속이 허용되는 서버의 주소
```

> ⚠️ **주의:**  
> `mysql/init.sql` 파일의 최상단에는 데이터베이스 유저와 패스워드가 직접 명시되어 있습니다.  
> 실제 운영 환경에서는 아래 부분을 반드시 **본인 환경에 맞게 수정**하여 사용하세요.

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
```

- `'root'`와 `'1234'`를 실제 사용할 DB 계정과 비밀번호로 변경하세요.
- 보안을 위해 운영 환경에서는 강력한 비밀번호를 사용하고, 필요 시 권한 범위도 제한하세요.

## 컨테이너 신규/재빌드 방법

- **윈도우 환경:**  
  `rebuild.bat` 파일을 실행하면 기존 컨테이너를 삭제하고 새로 빌드할 수 있습니다.

- **리눅스/맥 환경:**  
  `rebuild.sh` 파일을 실행하면 기존 컨테이너를 삭제하고 새로 빌드할 수 있습니다.

> 두 스크립트 모두 프로젝트 루트 디렉토리에서 실행하세요.