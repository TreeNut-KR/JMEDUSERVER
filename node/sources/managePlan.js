const db = require('./db');
const express = require("express");
const router = express.Router();
const {logAttend, adminLog } = require('./logger');



///////플랜추가페이지로드
router.post("/plan_addPage", (req, res) => {
    db.query("SELECT school_pk, name FROM school", (error, results_school) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류 : 학교 불러오기 실패" });
      } else {
        db.query("SELECT teacher_pk, name FROM teacher", (error, results_teacher) => {
            if (error) {
              res.status(500).json({ success: false, message: "데이터베이스 오류 : 강사 불러오기 실패" });
            } else {
              res.json({ success: true, schools: results_school, teachers: results_teacher });
              
            }
          });
      }
    });
  });





module.exports = {
    router: router
  };