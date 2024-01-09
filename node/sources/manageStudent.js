//학생 추가, 수정, 삭제


const db = require('./main');
const router = express.Router();

/////////////////////학생조회
router.get("/students_view", (req, res) => {
    db.query("SELECT * FROM student", (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, students: results });
      }
    });
  });



  //////////////////////학생 검색
app.post("/students_search", (req, res) => {
    const { search } = req.body;
    let query = "SELECT * FROM student";
    if (search.text != "") {
      query = `SELECT * FROM student where ${search.option} = '${search.text}'`;
    }
    db.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true, students: results, search: search });
      }
    });
  });
  
  //////////////////////학생 자세히 보기
  router.post("/students_view_detail", (req, res) => {
    const { student_pk } = req.body;
    db.query(
      "SELECT * FROM student where student_pk = ?",
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


///////학생추가
router.post("/students_add", (req, res) => {
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
      "INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)";
  
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
  

//////////////////////학생 정보 수정
router.put("/students_view_update", (req, res) => {
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
  
    const query = `UPDATE student SET name = ?, sex_ism = ?, birthday = ?, contact = ? ,contact_parent = ?, school = ?, payday = ?, firstreg = ? WHERE student_pk = ?`;
  
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
  router.put("/students_view_update_all", (req, res) => {
    const { editObject, editTarget } = req.body;
  
    const query = `UPDATE student SET ${editObject.option} = '${editObject.text}' WHERE student_pk IN (${editTarget})`;
  
    db.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true });
      }
    });
  });


  module.exports = router;