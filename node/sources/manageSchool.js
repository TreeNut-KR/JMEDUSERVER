const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require('./auth');
const { logAttend, adminLog } = require("./logger");

/////////////////////학교조회
router.post("/server/school/view", checkAuthenticated("schools_view"),async (req, res) => {
  const { is_elementary, is_middle, is_high } = req.body;

  db.query(
    "SELECT * FROM school WHERE is_elementary = ? AND is_middle = ? AND is_high = ? AND deleted_at IS NULL",
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, school: results });
        adminLog(req.session.user, "학교 목록을 조회했습니다.");
      }
    }
  );
});

//학교 추가
router.post("/server/school/add", checkAuthenticated("school_add"),async (req, res) => {
  const { name, is_elementary, is_middle, is_high } = req.body;

  // 데이터 삽입 쿼리
  const query =
    "INSERT INTO student (name, is_elementary, is_middle, is_high) VALUES (?, ?, ?, ?)";

  // 데이터베이스에 쿼리 실행
  db.query(query, [name, is_elementary, is_middle, is_high], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("사용자가 성공적으로 등록되었습니다.");
    adminLog(req.session.user, "학교를 추가했습니다. 학교 이름 : "+name);
  });
});

//학교 수정
router.post("/server/school/update", checkAuthenticated("school_update"), async (req, res) => {
  const { name, is_elementary, is_middle, is_high, school_pk } = req.body;

  const query =
    "UPDATE school SET name = ?, is_elementary = ?, is_middle = ?, is_high = ? WHERE school_pk = ?";

  db.query(query, [name, is_elementary, is_middle, is_high, school_pk], (err, result) => {
    if (err) {
      console.error("데이터 수정 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("해당하는 학교가 없습니다.");
    } else {
      res.status(200).send("학교가 성공적으로 수정되었습니다.");
      const logMsg = "학교 정보를 수정했습니다. 대상 학교 코드 : "+school_pk+", 학교명 : "+name+", 초등 : "+is_elementary+", 중학 : "+is_middle+", 고등 : "+is_high;
      adminLog(rqq.session.user,logMsg);
    }
  });
});



//학교 삭제
router.post("/server/school/remove", checkAuthenticated("school_remove"),async (req, res) => {
  const { id } = req.body;

  // 데이터 삽입 쿼리
  const query = "UPDATE school SET deleted_at = CURDATE() WHERE school_pk = ?;";

  // 데이터베이스에 쿼리 실행
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("학교 삭제 완료.");
    const logMsg  = "학교 정보를 삭제했습니다. 학교 코드 : "+id;
    adminLog(req.session.user, logMsg);
  });
});

module.exports = {
  router: router,
};
