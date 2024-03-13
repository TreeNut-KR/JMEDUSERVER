//학생 추가, 수정, 삭제

const db = require("./db");
const express = require("express");
const router = express.Router();
const { logAttend, adminLog } = require("./logger");
const { checkAuthenticated } = require('./auth');

function makeStudentSearchQuery(text, option) {
  //console.log(body);
  let baseQuery = "SELECT * FROM student";
  let whereClauses = [];
  let queryParams = [];

  if (text !== "") {
    whereClauses.push(`${option} LIKE ?`);
    queryParams.push(text);
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  return {
    query: baseQuery,
    params: queryParams,
  };
}

/////////////////////학생조회
router.post("/server/students_view", checkAuthenticated, (req, res) => {

  
  db.query("SELECT * FROM student", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, students: results });
    }
  });
});

//////////////////////학생 검색
router.post("/server/students_search", (req, res) => {
  const { search } = req.body; // 'search' 객체 추출
  console.log(search);
  const { query, params } = makeStudentSearchQuery(search.text, search.option);
  db.query(query, params, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, students: results, search: search });
      console.log("-------------------------");
      console.log(results);
    }
  });
});

//////////////////////학생 자세히 보기
router.post("/server/students_view_detail", (req, res) => {
  const { student_pk } = req.body;
  db.query(
    "SELECT * from student WHERE student_pk = ?;",
    [student_pk],
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, students: results });
      }
    }
  );
});

///////학생추가 페이지 로드
router.post("/server/students_addPage", (req, res) => {
  db.query("SELECT school_pk, name FROM school", (error, results_school) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "데이터베이스 오류 : 학교 불러오기 실패",
      });
    } else {
      res.json({ success: true, schools: results_school });
    }
  });
});

///////학생추가
router.post("/server/students_add", (req, res) => {
  const {
    name,
    sex_ism,
    birthday,
    contact,
    contact_parent,
    school,
    payday,
    firstreg,
  } = req.body;

  // 데이터 삽입 쿼리
  const query =
    "INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?);";

  // 데이터베이스에 쿼리 실행
  db.query(
    query,
    [
      name,
      sex_ism,
      birthday,
      contact,
      contact_parent,
      school,
      payday,
      firstreg,
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

/////////////학생 추가 (여러명)
router.post("/server/students_add_multiple", (req, res) => {
  const studentsData = req.body.DataStudents;
  console.log(studentsData);
  // 데이터 삽입 쿼리
  const query =
    "INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)";
  console.log(studentsData);
  // 학생 데이터를 각각 데이터베이스에 삽입
  studentsData.forEach((student) => {
    const values = [
      student.name,
      student.sex_ism,
      student.birthday,
      student.contact,
      student.contact_parent,
      student.school,
      student.payday,
      student.firstreg,
    ];

    // 데이터베이스에 쿼리 실행
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("데이터 삽입 중 오류 발생:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
    });
  });

  res.status(200).send("사용자가 성공적으로 등록되었습니다.");
});

//////////////////////학생 정보 수정
router.put("/server/students_view_update", (req, res) => {
  const {
    student_pk,
    name,
    sex_ism,
    birthday,
    contact,
    contact_parent,
    school,
    payday,
    firstreg,
  } = req.body;

  const query = `UPDATE student SET name = ?, sex_ism = ?, birthday = ?, contact = ? ,contact_parent = ?, school = ?,payday = ?, firstreg = ? WHERE student_pk = ?`;

  db.query(
    query,
    [
      name,
      sex_ism,
      birthday,
      contact,
      contact_parent,
      school,
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

//////////////////////학생 정보 수정 (여러개 한번에)
router.post("/server/students_view_update_all", (req, res) => {
  const { editObject, editTarget } = req.body;

  let query;

  if (editObject.option === "remove") {
    query = `DELETE FROM student WHERE student_pk IN (${editTarget})`;
  } else {
    query = `UPDATE student SET ${editObject.option} = '${editObject.text}' WHERE student_pk IN (${editTarget})`;
  }
  console.log("editobject:", editObject, "쿼리 : ", query);
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true });
    }
  });
});

//학생 삭제
router.post("/server/student_remove", (req, res) => {
  const { id } = req.body;

  // 데이터 삽입 쿼리
  const query = "DELETE FROM student WHERE student_pk = ?";

  // 데이터베이스에 쿼리 실행
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("사용자가 성공적으로 등록되었습니다.");
  });
});

module.exports = {
  router: router,
};
