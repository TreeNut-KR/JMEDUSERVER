-- jmedu 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS jmedu;
USE jmedu;

-- 학생 테이블
CREATE TABLE student (
    student_pk BINARY(16),
    name VARCHAR(20),
    sex_ism BOOL,
    birthday DATE,
    contact VARCHAR(20),
    contact_parent VARCHAR(20),
    school BINARY(16),
    payday INT,
    firstreg DATE,
    PRIMARY KEY(student_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 교사 테이블
CREATE TABLE teacher (
    teacher_pk BINARY(16),
    name VARCHAR(20),
    sex_ism BOOL,
    birthday DATE,
    contact VARCHAR(20),
    id VARCHAR(20),
    pwd VARCHAR(20),
    is_admin BOOL,
    PRIMARY KEY(teacher_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 수강 로그 테이블
CREATE TABLE attend_log (
    attend_log_pk BINARY(16),
    student BINARY(16),
    time DATETIME,
    is_attend BOOL,
    is_gohome BOOL,
    PRIMARY KEY(attend_log_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 교사 수강 로그 테이블
CREATE TABLE teacher_attend_log (
    teacher_attend_log_pk BINARY(16),
    teacher VARCHAR(20),
    time DATETIME,
    is_attend BOOL,
    PRIMARY KEY(teacher_attend_log_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 학교 테이블
CREATE TABLE school (
    school_pk BINARY(16),
    name VARCHAR(30),
    is_elementary BOOL,
    is_middle BOOL,
    is_high BOOL,
    PRIMARY KEY(school_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 과목 테이블
CREATE TABLE subject (
    subject_pk BINARY(16),
    name VARCHAR(20),
    time DATETIME,
    teacher BINARY(16),
    PRIMARY KEY(subject_pk),
    FOREIGN KEY (teacher) REFERENCES teacher(teacher_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 학생-과목 연결 테이블
CREATE TABLE student_subject (
    student_subject_pk BINARY(16),
    student_id BINARY(16),
    subject_id BINARY(16),
    PRIMARY KEY(student_subject_pk),
    FOREIGN KEY (student_id) REFERENCES student(student_pk),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_pk)
) ENGINE=MYISAM CHARSET=utf8;

-- 관리자 로그 테이블
CREATE TABLE admin_log (
    admin_log_pk BINARY(16),
    teacher BINARY(16),
    time DATETIME,
    log VARCHAR(255),
    PRIMARY KEY(admin_log_pk)
) ENGINE=MYISAM CHARSET=utf8;