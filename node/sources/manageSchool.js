const db = require('./db');
const express = require("express");
const router = express.Router();




/////////////////////학교조회
router.post("/students_view", (req, res) => {
    const {
        is_elementary,
        is_middle,
        is_high
      } = req.body;

    db.query("SELECT * FROM school WHERE is_elementary = ? AND is_middle = ? AND is_high = ?", (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, school: results });
      }
    });
  });



//학교 추가
router.post("/school_add", (req, res) => {
    const {
      name,
      is_elementary,
      is_middle,
      is_high
    } = req.body;
  
    // 데이터 삽입 쿼리
    const query =
      "INSERT INTO student (school_pk, name, is_elementary, is_middle, is_high) VALUES (UUID(), ?, ?, ?, ?)";
  
    // 데이터베이스에 쿼리 실행
    db.query(
      query,
      [
        name,
        is_elementary,
        is_middle,
        is_high,
      ],
      (err, result) => {
        if (err) {
          console.error("데이터 삽입 중 오류 발생:", err);
          res.status(500).send("서버 오류가 발생했습니다.");
          return;
        }
        res.status(200).send("사용자가 성공적으로 등록되었습니다.");
      }
    );
  });



module.exports = router;