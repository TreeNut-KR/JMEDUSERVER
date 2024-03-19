//교직원 추가, 수정, 삭제

const db = require('./db');
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require('./auth');
const {logAttend, adminLog } = require('./logger');



/////////////////////강사조회
router.post("/server/teacher_view",checkAuthenticated("teacher_view"), async (req, res) => {
    db.query("SELECT * FROM teacher", (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, students: results });
      }
    });
  });
  
  //////////////////////강사 정보 수정
  router.put("/server/teacher_update",checkAuthenticated("teacher_update"), async (req, res) => {
      const {
        student_pk,
        name,
        sex_ism,
        birthday,
        contact,
        contact_parent,
        school,
        grade,
        payday,
        firstreg,
      } = req.body;
    
      const query = `UPDATE student SET name = ?, sex_ism = ?, birthday = ?, contact = ? ,contact_parent = ?, school = ?, grade = ? ,payday = ?, firstreg = ? WHERE student_pk = ?`;
    
      db.query(
        query,
        [
          name,
          sex_ism,
          birthday,
          contact,
          contact_parent,
          school,
          grade,
          payday,
          firstreg,
          student_pk,
        ],
        (error, results) => {
          if (error) {
            res.status(500).json({ success: false, message: "데이터베이스 오류" });
          } else {
            res.json({ success: true });
          }
        }
      );
    });


module.exports = {
    router: router
  };
  