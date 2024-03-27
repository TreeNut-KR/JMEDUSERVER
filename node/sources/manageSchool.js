const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require('./auth');
const { logAttend, adminLog } = require("./logger");

/////////////////////학교조회
router.post("/server/school/view", checkAuthenticated("schools_view"),async (req, res) => {
  const { is_elementary, is_middle, is_high } = req.body;

  db.query(
    "SELECT * FROM school WHERE is_elementary = ? AND is_middle = ? AND is_high = ?",
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, school: results });
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
  });
});

//학교 수정
router.post("/server/school/update", checkAuthenticated("school_update"), async (req, res) => {
  const { name, is_elementary, is_middle, is_high, school_pk } = req.body;

  const query =
    "UPDATE plan SET name = ?, is_elementary = ?, is_middle = ?, is_high = ? WHERE school_pk = ?";

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
    }
  });
});



//학교 삭제
router.post("/server/school/remove", checkAuthenticated("school_remove"),async (req, res) => {
  const { id } = req.body;

  // 데이터 삽입 쿼리
  const query = "DELETE FROM school WHERE school_pk = ?";

  // 데이터베이스에 쿼리 실행
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("학교 삭제 완료.");
  });
});

module.exports = {
  router: router,
};
