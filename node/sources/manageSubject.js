//수업일정 조회, 등록, 삭제

const db = require('./db');
const express = require("express");
const router = express.Router();
const {logAttend, adminLog } = require('./logger');




///////과목추가페이지로드
router.post("/subject_addPage", (req, res) => {
    db.query("SELECT school_pk, name FROM school", (error, results_school) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류 : 학교 불러오기 실패" });
      } else {
        db.query("SELECT school_pk, name FROM school", (error, results_teacher) => {
            if (error) {
              res.status(500).json({ success: false, message: "데이터베이스 오류 : 강사 불러오기 실패" });
            } else {
              res.json({ success: true, schools: results_school, teachers: results_teacher });
              
            }
          });
      }
    });
  });


///////과목추가 실행
router.post("/subject_add", (req, res) => {
    const {
      name,
      teacher,
      school,
      grade,
      is_personal,
      week,
      starttime,
      endtime,
      room,
    } = req.body;
  
    // 데이터 삽입 쿼리
    const query =
      "INSERT INTO subject (subject_pk, name, teacher, school, grade, is_personal, week, starttime, endtime, room) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    // 데이터베이스에 쿼리 실행
    db.query(
      query,
      [
        name,
        teacher,
        school,
        grade,
        is_personal,
        week,
        starttime,
        endtime,
        room,
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


  //과목에 학생 추가


  module.exports = {
    router: router
  };