const db = require('./db');
const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');


function getDayOfWeek() {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const now = new Date();
    const dayOfWeek = days[now.getDay()];
    return dayOfWeek;
  }


//강의를 시작할 때의 페이지 로드, 이 때 해당 강사가 개설한 오늘의 플랜 목록을 보여줌
router.post("/server/checkAttend/Page1", checkAuthenticated("checkAttend"),async (req, res) => {
    const teacher_pk = req.session.user.teacher_pk;
    const week = getDayOfWeek();
    const query = `
    SELECT 
    p.plan_pk,
    p.week,
    p.starttime,
    p.endtime,
    p.room,
    sub.name AS subject_name,
    t.name AS teacher_name,
    sc.name AS school_name
    FROM 
      plan p
    INNER JOIN 
      subject sub ON p.subject = sub.subject_pk
    INNER JOIN 
      teacher t ON sub.teacher = t.teacher_pk
    INNER JOIN 
      school sc ON sub.school = sc.school_pk
    WHERE t.teacher_pk = ? AND p.week = ?;
    `;
  
    // 데이터베이스에 쿼리 실행
    db.query(query, [teacher_pk, week], (err, result) => {
      if (err) {
        console.error("데이터 삽입 중 오류 발생:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
      res.status(200).send("강의 시작 처리를 위한 시간표가 성공적으로 로드되었습니다.");
    });
  });






//강의 선택 후 해당 과목을 듣는 수강생의 최근 등하원 기록 로드
router.post("/server/checkAttend/Page2", checkAuthenticated("checkAttend"), async (req, res) => {
  const { plan } = req.body;

  try {
    // 해당 수업을 듣는 모든 학생 불러오기
    const [students] = await db.promise().query(`
      SELECT ss.student_id
      FROM student_subject ss
      JOIN plan p ON ss.subject_id = p.subject
      WHERE p.plan_pk = ?;
    `, [plan]);

    if (students.length === 0) {
      res.status(404).send("해당 수업을 듣는 학생이 없습니다.");
      return;
    }

    console.log("1차 쿼리 완료. 2차 쿼리 실행");

    // 학생의 이름, 생년월일, 출석기록 가져오기
    const studentIds = students.map(row => row.student_id);
    const placeholders = studentIds.map(() => '?').join(',');
    const query2 = `
      SELECT al.*, s.name, s.birthday
      FROM attend_log al
      INNER JOIN (
        SELECT student, MAX(time) AS max_time
        FROM attend_log
        WHERE student IN (${placeholders}) AND time >= CURDATE()
        GROUP BY student
      ) AS latest_records ON al.student = latest_records.student AND al.time = latest_records.max_time
      INNER JOIN student s ON al.student = s.student_pk
      WHERE al.time >= CURDATE();
    `;

    const [attendances] = await db.promise().query(query2, studentIds);

    res.status(200).send(attendances);
  } catch (err) {
    console.error("데이터 처리 중 오류 발생:", err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});








//강사가 수정한 로그를 강의 출석부에 반영
router.post("/server/checkAttend/submit", checkAuthenticated("checkAttend"), async (req, res) => {
  const { plan, teacher, studentList } = req.body;
  try {
    const subjectExecutedPk = await insertSubjectExecuted(plan, teacher);
    await insertSubjectExecutedAttenders(subjectExecutedPk, studentList);
  } catch (error) {
    console.error('DB 작업 중 오류 발생:', error);
  }
});


// subject_executed 테이블에 강의 실시된 기록 하기
async function insertSubjectExecuted(plan, teacher) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [rows] = await pool.query(
    'INSERT INTO subject_executed (plan, teacher, started) VALUES (?, ?, ?)',
    [plan, teacher, now]
  );
  return rows.insertId;
}

//그 실행된 강의에 대한 출석 기록
async function insertSubjectExecutedAttenders(subjectExecutedPk, studentList) {
  const values = studentList.map(({ student, is_attended }) => [subjectExecutedPk, student, is_attended]);
  const query = `
    INSERT INTO subject_executed_attenders (subject_executed, student, is_attended) 
    VALUES ${values.map(() => '(?, ?, ?)').join(', ')}
  `;
  await pool.query(query, values.flat());
}

