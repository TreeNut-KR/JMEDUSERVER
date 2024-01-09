//공지

const db = require('./main');
const express = require("express");
const router = express.Router();


//조건부 공지
router.post("/condition_note", (req, res) => {
    const { name, sex_ism, contact, contact_parent, school, payday } = req.body;
    const selectAll = true;
  
    // 'student' 테이블 조회 쿼리문 넣기
    db.query(searchStudent, (error, results, fields) => {
      if (error) {
        // 데이터베이스 쿼리 중 오류 발생 시
        res
          .status(500)
          .json({ success: false, message: "데이터베이스 오류", error: error });
      } else {
        // 쿼리가 성공적으로 수행되면 결과 반환
        res.json({ success: true, students: results });
      }
    });
  });
  




module.exports = router;