//등하원, 접근기록 등등

const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("./auth");

//등하원기록
async function logAttend(qrcode, is_attend, is_late, now) {
  // 결과 날짜를 YYYY-MM-DD 형식으로 변환합니다.
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
  const dd = String(now.getDate()).padStart(2, "0");

  const time = `${yyyy}-${mm}-${dd}`;

  const query = "INSERT INTO attend_log (student, time, is_attend, is_late) VALUES (?, ?, ?, ?)";

  db.query(query, [qrcode, time, is_attend, is_late], (err, result) => {
    if (err) {
      console.error("출결 로그 중 오류 발생:", err);
      return;
    }
  });
}

/////////////////////기록조회
router.post("/server/log/view", checkAuthenticated("logs_view"), async (req, res) => {
  const { is_elementary, is_middle, is_high } = req.body;

  db.query("SELECT * FROM admin_log", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, log: results });
      adminLog(req.session.user, "로그 조회했습니다.");
    }
  });
});

//출퇴근기록
async function logAttend_teacher(qrcode, is_attend, now) {
  // 결과 날짜를 YYYY-MM-DD 형식으로 변환합니다.
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
  const dd = String(now.getDate()).padStart(2, "0");

  const time = `${yyyy}-${mm}-${dd}`;

  const query = "INSERT INTO attend_log (teacher, time, is_attend) VALUES (?, ?, ?)";

  db.query(query, [qrcode, time, is_attend, is_late], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      return;
    }
  });
}

//관리접근기록
async function adminLog(teacher_session, log) {
  const teacher_id = teacher_session.id;
  let now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 1을 플러스
  const dd = String(now.getDate()).padStart(2, "0");
  const time = `${yyyy}-${mm}-${dd}`;

  const query = "INSERT INTO admin_log (teacher, time, log) VALUES (?, ?, ?)";

  db.query(query, [teacher_id, time, log], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      return;
    }
  });
}

module.exports = {
  router: router,
  logAttend: logAttend,
  adminLog: adminLog,
};
