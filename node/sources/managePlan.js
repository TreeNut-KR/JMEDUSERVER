const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("./auth");
const { logAttend, adminLog } = require("./logger");

// 플랜 조회
router.post("/server/schedules_search", checkAuthenticated("schedules_search"), async (req, res) => {
  const { subject_pk } = req.body; // subject_pk 값 입력하면 검색기능 추가 하도록 했음

  let query = `
  SELECT 
  p.plan_pk,
  p.week,
  p.subject,
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
  WHERE 
    p.deleted_at IS NULL
  `;

  if (subject_pk) {
    query += ` AND p.subject = ?`;
  }

  query += ` ORDER BY p.starttime ASC`;

  db.query(query, [subject_pk], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, schedules: results });
      adminLog(req.session.user, "시간표를 조회했습니다.");
    }
  });
});

//플랜 검색
router.post("/server/subjects_view_detail", checkAuthenticated("subjects_view_detail"), async (req, res) => {
  const { plan_pk } = req.body;

  // 데이터 삽입 쿼리
  const query = `SELECT 
  p.plan_pk,
  p.week,
  p.subject,
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
  WHERE 
    p.plan_pk = ?;`;

  // 데이터베이스에 쿼리 실행
  db.query(query, [plan_pk], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, plans: results });
      adminLog(req.session.user, "시간표를 조회했습니다.");
    }
  });
});

///////플랜추가페이지로드
router.post("/server/plan/add/Page", checkAuthenticated("plan_add"), async (req, res) => {
  const query = `
    SELECT 
      s.subject_pk,
      s.name AS subject_name,
      t.name AS teacher_name,
      sc.name AS school_name,
      s.grade,
      s.is_personal
    FROM 
      subject s
    INNER JOIN 
      teacher t ON s.teacher = t.teacher_pk
    INNER JOIN 
      school sc ON s.school = sc.school_pk;
    WHERE
      s.deleted_at IS NULL;
  `;

  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, school: results });
    }
  });
});

//플랜 추가
router.post("/server/schedule_add", checkAuthenticated("schedule_add"), async (req, res) => {
  const { subject, week, starttime, endtime, room } = req.body;

  // 데이터 삽입 쿼리
  const query = "INSERT INTO plan (subject, week, starttime, endtime, room, created_at) VALUES (?, ?, ?, ?, ?, NOW())";

  // 데이터베이스에 쿼리 실행
  db.query(query, [subject, week, starttime, endtime, room], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("시간표가 성공적으로 등록되었습니다.");
  });
});

// 플랜 수정
router.post("/server/plan_update", checkAuthenticated("plan_update"), async (req, res) => {
  const { plan_pk, subject, week, starttime, endtime, room } = req.body;

  const query = "UPDATE plan SET subject = ?, week = ?, starttime = ?, endtime = ?, room = ? WHERE plan_pk = ?";

  db.query(query, [subject, week, starttime, endtime, room, plan_pk], (err, result) => {
    if (err) {
      console.error("데이터 수정 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("해당하는 시간표가 없습니다.");
    } else {
      res.status(200).send("시간표가 성공적으로 수정되었습니다.");
    }
  });
});

// 플랜 삭제
router.post("/server/plan/remove", checkAuthenticated("plan_remove"), async (req, res) => {
  // 요청 바디로부터 id 추출
  const { plan_pk } = req.body;
  const query = "UPDATE plan SET deleted_at = NOW() WHERE plan_pk = ?";
  db.query(query, [plan_pk], (err, result) => {
    if (err) {
      console.error("데이터 삭제 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("해당하는 시간표가 없습니다.");
    } else {
      res.status(200).send("시간표가 성공적으로 삭제되었습니다.");
    }
  });
});

module.exports = {
  router: router,
};
