//수업일정 조회, 등록, 삭제

const db = require('./db');
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require('./auth');
const {logAttend, adminLog } = require('./logger');




///////과목추가페이지로드
router.post("/server/subject/add/Page",checkAuthenticated("subject_add"),async (req, res) => {
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


///////과목추가 실행
router.post("/server/subject/add",checkAuthenticated("subject_add"), async (req, res) => {
    const {
      name,
      teacher,
      school,
      grade,
      is_personal,
    } = req.body;
  
    // 데이터 삽입 쿼리
    const query =
      "INSERT INTO subject (name, teacher, school, grade, is_personal) VALUES (?, ?, ?, ?, ?)";
  
    // 데이터베이스에 쿼리 실행
    db.query(
      query,
      [
        name,
        teacher,
        school,
        grade,
        is_personal,
      ],
      (err, result) => {
        if (err) {
          console.error("데이터 삽입 중 오류 발생:", err);
          res.status(500).send("서버 오류가 발생했습니다.");
          return;
        }
        res.status(200).send("과목이 성공적으로 등록되었습니다.");
      }
    );
  });

    //과목 삭제
router.post("/server/subject/remove",checkAuthenticated("subject_remove"), async (req, res) => {
    const {
      id,
    } = req.body;
  
    // 데이터 삽입 쿼리
    const query =
      "UPDATE subject SET deleted_at = CURDATE() WHERE subject_pk = ?";
  
    // 데이터베이스에 쿼리 실행
    db.query(
      query,
      [
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("삭제 중 오류 발생:", err);
          res.status(500).send("서버 오류가 발생했습니다.");
          return;
        }
        res.status(200).send("삭제 완료.");
        adminLog(req.session.user, "과목을 삭제했습니다. 과목 코드 : "+id);
      }
    );
  });
  

//////////////////////과목 수정
router.put("/server/subject/update",checkAuthenticated("subject_update"), async (req, res) => {
  const {
    subject_pk,
    name,
    teacher,
    school,
    grade,
    is_personal,
  } = req.body;

  const query = `UPDATE subject SET name = ?, teacher = ?, school = ?, grade = ? ,is_personal = ? WHERE subject_pk = ?`;

  db.query(
    query,
    [
      name,
      teacher,
      school,
      grade,
      is_personal,
      subject_pk,
    ],
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true });
        adminLog(req.session.user, "과목 정보를 수정했습니다. 과목 코드 : "+subject_pk);
      }
    }
  );
});





///////////////////////////////////////////////////////////////////////////////////////////////////////////////


  //과목에 학생 추가 페이지 로드
router.post("/server/subject_student_addPage",checkAuthenticated("subject_student_add"), async (req, res) => {
  db.query("SELECT student.student_pk, student.name, student.grade, school.name FROM student JOIN school ON student.school = school.school_pk WHERE student.deleted_at IS NULL;", (error, results_school) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류 : 학교 불러오기 실패" });
    } else {
      db.query("SELECT subject_pk, name, grade, school FROM student WHERE deleted_at IS NULL", (error, results_teacher) => {
          if (error) {
            res.status(500).json({ success: false, message: "데이터베이스 오류 : 강사 불러오기 실패" });
          } else {
            res.json({ success: true, schools: results_school, teachers: results_teacher });
            
          }
        });
    }
  });
});






  //과목에 학생 추가
router.post("/server/subject_student_add",checkAuthenticated("subject_student_add"), async (req, res) => {
  const {
    student_pk,
    subject_pk,
  } = req.body;

  // 데이터 삽입 쿼리
  let query = "INSERT INTO student_subject (student_id, subject_id) VALUES ";


  let params = [
      [student_pk[0], subject_pk]
    ];

  for(var i = 1; i<student_pk.length; i++)
    {
      params.push([student_pk[i], subject_pk]);
    }
  let placeholders = params.map(() => "(?, ?)").join(", ");


  // 데이터베이스에 쿼리 실행
  db.query(query+placeholders, params.flat(), async (err, result) => {
      if (err) {
        console.error("데이터 삽입 중 오류 발생:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
      res.status(200).send("성공적으로 등록되었습니다.");
    }
  );
});





  module.exports = {
    router: router
  };