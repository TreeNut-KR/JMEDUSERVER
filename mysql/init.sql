-- jmedu 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS jmedu;

SHOW WARNINGS;

USE jmedu;



-- 학생 테이블
CREATE TABLE student (
    student_pk CHAR(36),
    name VARCHAR(20), /*이름*/
    sex_ism BOOL, /*성별*/
    grade INT, /*예비 1학년은 0으로 설정, 1, 2, 3학년*/
    birthday DATE, /*생일*/
    contact VARCHAR(20), /*연락처*/
    contact_parent VARCHAR(20), /*부모연락처*/
    school CHAR(36), /*소속학교*/
    payday INT, /*결제일*/
    firstreg DATE, /*최초등록일*/
    is_enable BOOL, /*활성화 여부*/
    
    PRIMARY KEY(student_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;


-- 교사 테이블
CREATE TABLE teacher (
    teacher_pk CHAR(36),
    name VARCHAR(20),
    sex_ism BOOL,
    birthday DATE,
    contact VARCHAR(20),
    id VARCHAR(20),
    pwd VARCHAR(255),
    is_admin BOOL,
    PRIMARY KEY(teacher_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 교사 가입 승인 대기 테이블
CREATE TABLE teacher_pending (
    teacher_pending_pk CHAR(36),
    name VARCHAR(20),
    sex_ism BOOL,
    birthday DATE,
    contact VARCHAR(20),
    id VARCHAR(20),
    pwd VARCHAR(255),
    PRIMARY KEY(teacher_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 등하원 로그 테이블
CREATE TABLE attend_log (
    attend_log_pk CHAR(36),
    student CHAR(36),
    time DATETIME,
    is_attend BOOL, /*true는 등원, false는 하원*/
    is_late BOOL,
    PRIMARY KEY(attend_log_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 교사 출퇴근 로그 테이블
CREATE TABLE teacher_attend_log (
    teacher_attend_log_pk CHAR(36),
    teacher CHAR(36),
    time DATETIME,
    is_attend BOOL,
    PRIMARY KEY(teacher_attend_log_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 학교 테이블
CREATE TABLE school (
    school_pk CHAR(36),
    name VARCHAR(30),
    is_elementary BOOL,
    is_middle BOOL,
    is_high BOOL,
    PRIMARY KEY(school_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 과목 테이블
CREATE TABLE subject (
    subject_pk CHAR(36),/*과목코드*/

    name VARCHAR(20),/*과목이름*/
    teacher CHAR(36),/*담당강사(외부키)*/
    school CHAR(36),/*대상학교(외부키)*/
    grade INT,/*대상학년*/
    is_personal BOOL,/*개인과외여부*/

    week VARCHAR(3),/*요일*/
    starttime INT,/*시작시간*/
    endtime INT,/*종료시간*/

    room VARCHAR(20)/*강의실*/

    PRIMARY KEY(subject_pk),/*주키설정*/
    FOREIGN KEY (teacher) REFERENCES teacher(teacher_pk)/*외부키 설정*/
    FOREIGN KEY (school) REFERENCES school(school_pk)/*외부키 설정*/
) ENGINE=InnoDB CHARSET=utf8mb4;




-- 학생-과목 연결 테이블
CREATE TABLE student_subject (
    student_subject_pk CHAR(36),
    student_id CHAR(36),
    subject_id CHAR(36),
    PRIMARY KEY(student_subject_pk),
    FOREIGN KEY (student_id) REFERENCES student(student_pk),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 관리자 로그 테이블
CREATE TABLE admin_log (
    admin_log_pk CHAR(36),
    teacher CHAR(36),
    time DATETIME,
    log VARCHAR(255),
    PRIMARY KEY(admin_log_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;


-- 설정 테이블
CREATE TABLE config (
    config_pk CHAR(1),
    logout_time INT,/*자동 로그아웃 시간 설정(분단위)*/
    payday_prenote_toggle BOOL,
    payday_prenote INT,
    PRIMARY KEY(config_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

--설정 기본값 삽입(설정 데이터가 없는 경우
INSERT INTO config (config_pk, logout_time, payday_prenote)
SELECT * FROM (SELECT 0, 60, false, 3) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM config WHERE config_pk = 0
);


-- 테스트용 쿼리

INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg) VALUES
(UUID(), '윤현우', 0, '2017-09-30', '7499762664', '2114485983', '2', 2, '2023-12-29'),
(UUID(), '최지후', 0, '2013-07-23', '7057073914', '9496569546', '3', 22, '2023-12-29'),
(UUID(), '윤지호', 0, '2012-02-24', '6964067984', '7407543785', '2', 14, '2023-12-29'),
(UUID(), '이서인', 1, '2010-12-13', '9365990144', '7918873387', '2', 7, '2023-12-29'),
(UUID(), '김서준', 0, '2015-04-16', '3102686675', '1309516715', '1', 3, '2023-12-29'),
(UUID(), '임지호', 0, '2008-05-20', '7108684813', '6488957024', '2', 1, '2023-12-29'),
(UUID(), '윤현진', 1, '2017-03-06', '0488810491', '9949495722', '3', 10, '2023-12-29'),
(UUID(), '윤민준', 0, '2007-12-12', '3953807259', '9347564627', '3', 11, '2023-12-29'),
(UUID(), '정연우', 1, '2014-04-27', '3029462453', '9933618782', '3', 27, '2023-12-29'),
(UUID(), '강시우', 0, '2010-11-14', '2385589254', '8290078831', '2', 21, '2023-12-29');

