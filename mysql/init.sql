GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SET NAMES 'utf8mb4';



-- jmedu 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS jmedu;

SHOW WARNINGS;

USE jmedu;

-- 학교 테이블
CREATE TABLE school (
    school_pk INT AUTO_INCREMENT,
    name VARCHAR(30),
    is_elementary BOOL,
    is_middle BOOL,
    is_high BOOL,
    PRIMARY KEY(school_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 학생 테이블
CREATE TABLE student (
    student_pk CHAR(36),
    name VARCHAR(20), /*이름*/
    sex_ism BOOL, /*성별*/
    grade INT, /*예비 1학년은 0으로 설정, 1, 2, 3학년*/
    birthday DATE, /*생일*/
    contact VARCHAR(20), /*연락처*/
    contact_parent VARCHAR(20), /*부모연락처*/
    school INT, /*소속학교*/
    payday INT, /*결제일*/
    firstreg DATE, /*최초등록일*/
    is_enable BOOL, /*활성화 여부*/
    PRIMARY KEY(student_pk),
    FOREIGN KEY (school) REFERENCES school(school_pk)/*외부키 설정*/
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
    admin_level INT, /* 0 : 가입 대기, 1 : 일반 강사, 2 : 관리 강사, 3 : 원장 */
    PRIMARY KEY(teacher_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;



-- 등하원 로그 테이블
CREATE TABLE attend_log (
    attend_log_pk INT AUTO_INCREMENT,
    student CHAR(36),
    time DATETIME,
    is_attend BOOL, /*true는 등원, false는 하원*/
    is_late BOOL,
    PRIMARY KEY(attend_log_pk),
    FOREIGN KEY (student) REFERENCES student(student_pk) /*외부키 설정*/
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 교사 출퇴근 로그 테이블
CREATE TABLE teacher_attend_log (
    teacher_attend_log_pk INT AUTO_INCREMENT,
    teacher CHAR(36),
    time DATETIME,
    is_attend BOOL,
    PRIMARY KEY(teacher_attend_log_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 과목 테이블
CREATE TABLE subject (
    subject_pk INT AUTO_INCREMENT,/*과목코드*/
    name VARCHAR(20),/*과목이름*/
    teacher CHAR(36),/*담당강사(외부키)*/
    school INT,/*대상학교(외부키)*/
    grade INT,/*대상학년*/
    is_personal BOOL,/*개인과외여부*/
    PRIMARY KEY(subject_pk),/*주키설정*/
    FOREIGN KEY (teacher) REFERENCES teacher(teacher_pk),/*외부키 설정*/
    FOREIGN KEY (school) REFERENCES school(school_pk)/*외부키 설정*/
) ENGINE=InnoDB CHARSET=utf8mb4;
-- 시간표 테이블
CREATE TABLE plan (
    plan_pk INT AUTO_INCREMENT,
    subject INT,
    week VARCHAR(3),/*요일(형식 : MON, TUE 등)*/
    starttime TIME,/*시작시간(형식 : 19시 30분의 경우 1930)*/
    endtime TIME,/*종료시간(형식 : 시작시간과 동일)*/
    room VARCHAR(20),/*강의실*/
    PRIMARY KEY(plan_pk),
    FOREIGN KEY (subject) REFERENCES subject(subject_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 학생-과목 연결 테이블
CREATE TABLE student_subject (
    student_subject_pk INT AUTO_INCREMENT,
    student_id CHAR(36),
    subject_id INT,
    PRIMARY KEY(student_subject_pk),
    FOREIGN KEY (student_id) REFERENCES student(student_pk),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 관리자 로그 테이블
CREATE TABLE admin_log (
    admin_log_pk INT AUTO_INCREMENT,
    teacher CHAR(36),
    time DATETIME,
    log VARCHAR(255),
    PRIMARY KEY(admin_log_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;


-- 권한 테이블
CREATE TABLE permissions (
    task_name VARCHAR(255),
    level INT,
    PRIMARY KEY(task_name)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 권한 기본 세팅값
INSERT INTO permissions (task_name, level) VALUES 
('students_view', 0),
('students_add', 0),
('students_edit', 0),
('students_search', 0),
('students_view_detail', 0),
('students_addPage', 0),
('students_add_multiple', 0),
('students_view_update', 0),
('students_view_update_all', 0),
('student_remove', 0),
('plan_addPage', 0),
('schools_view', 0),
('school_add', 0),
('school_remove', 0),
('subject_addPage', 0),
('subject_add', 0),
('subject_remove', 0),
('subject_update', 0),
('subject_student_addPage', 0),
('subject_student_add', 0),
('teacher_view', 0),
('teacher_update', 0),
('conditional_note', 0);



-- 설정 테이블
CREATE TABLE serverconf (
    config_pk INT,
    logout_time INT,/*자동 로그아웃 시간 설정(분단위)*/
    payday_prenote_toggle BOOL,
    payday_prenote INT,
    PRIMARY KEY(config_pk)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 설정 기본값 삽입(설정 데이터가 없는 경우)
INSERT INTO serverconf (config_pk, logout_time, payday_prenote_toggle, payday_prenote) SELECT 0, 60, false, 3 FROM DUAL WHERE NOT EXISTS (SELECT * FROM serverconf);

-- 테스트용 쿼리


INSERT INTO school (name, is_elementary, is_middle, is_high) VALUES 
('학교1', true, false, false),
('학교2', false, true, false),
('학교3', false, false, true),
('학교4', true, true, false),
('학교5', false, true, true),
('학교6', true, false, true),
('학교7', true, true, true),
('학교8', false, false, false),
('학교9', true, false, false),
('학교10', false, true, false);

INSERT INTO student (student_pk, name, sex_ism, grade, birthday, contact, contact_parent, school, payday, firstreg, is_enable) VALUES 
(UUID(), '김철수', true, 1, '2007-01-01', '01012341234', '01011111111', 1, 1, '2023-03-01', true),
(UUID(), '박영희', false, 2, '2006-02-02', '01023452345', '01022222222', 1, 2, '2023-03-02', false),
(UUID(), '이민지', false, 3, '2005-03-03', '01034563456', '01033333333', 2, 3, '2023-03-03', true),
(UUID(), '최준호', true, 0, '2008-04-04', '01045674567', '01044444444', 2, 4, '2023-03-04', false),
(UUID(), '홍길동', true, 1, '2007-05-05', '01056785678', '01055555555', 3, 5, '2023-03-05', true),
(UUID(), '장보람', false, 2, '2006-06-06', '01067896789', '01066666666', 3, 6, '2023-03-06', false),
(UUID(), '유재석', true, 3, '2005-07-07', '01078907890', '01077777777', 4, 7, '2023-03-07', true),
(UUID(), '김미나', false, 0, '2008-08-08', '01089018901', '01088888888', 4, 8, '2023-03-08', false),
(UUID(), '송기헌', true, 1, '2007-09-09', '01090129012', '01099999999', 5, 9, '2023-03-09', true),
(UUID(), '하은지', false, 2, '2006-10-10', '01001230123', '01000000000', 5, 10, '2023-03-10', false);
