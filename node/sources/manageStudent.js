//학생 추가, 수정, 삭제

const db = require("./db");
const express = require("express");
const router = express.Router();
const { logAttend, adminLog } = require("./logger");
const { checkAuthenticated } = require("./permission");
const xlsx = require('xlsx');
const fileUpload = require('express-fileupload');
const util = require('util');
const query = util.promisify(db.query).bind(db);
router.use(fileUpload());
const expectedHeaders = ['name', 'sex_ism', 'birthday', 'contact', 'contact_parent', 'school', 'payday', 'grade'];


////////엑셀로 학생 추가
router.post('/server/student_excel', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('파일이 업로드되지 않았습니다.');
    }
    if (req.body.type !== "student") {
      console.log("타입이 학생이 아님");
      return res.status(400).send('엑셀로 추가는 학생 데이터만 가능합니다.');
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // 첫 번째 행은 헤더
    const headers = jsonData[0];
    // 두 번째 행부터는 데이터
    let rows = jsonData.slice(1);

    // 빈 행 제거
    rows = rows.filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

    //학교 이름 리스트 부르기
    let schoolList = await query("SELECT school_pk, name FROM school");

    // 학교 이름 코드화
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === "school") {
        for (let j = 0; j < rows.length; j++) {//school 열의 각행
          if (rows[j][i] !== undefined && rows[j][i] !== null) {
            const schoolName = rows[j][i];
            console.log("코드화 변환 전 학교 이름 : "+rows[j][i])
            let school = schoolList.find(s => s.name === schoolName);
            console.log("school 변수 : " + JSON.stringify(school));

            if (!school) {//처음보는 학교의 경우
              await query(
                "INSERT INTO school (name, is_elementary, is_middle, is_high) VALUES (?, false, false, false)",
                [schoolName]
              );

              const newSchool = await query(
                "SELECT school_pk FROM school WHERE name = ?",
                [schoolName]
              );

              rows[j][i] = newSchool[0].school_pk;
              schoolList.push({ school_pk: newSchool[0].school_pk, name: schoolName }); // 새로 추가된 학교도 리스트에 추가
            } else {
              rows[j][i] = school.school_pk;
            }
          }
        }
      }
    }

    // 전화번호 필드 문자열화
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === "contact" || headers[i] === "contact_parent") {
        for (let j = 0; j < rows.length; j++) {
          if (rows[j][i] !== undefined && rows[j][i] !== null) {
            rows[j][i] = rows[j][i].toString();
          }
        }
      }
    }

    console.log("엑셀 데이터 : ", rows);

    // 헤더 유효성 검사
    if (headers.length === 0 || !headers.every(element => expectedHeaders.includes(element))) {
      return res.status(400).send('유효하지 않은 헤더 형식이 있습니다.');
    }

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      console.log("삽입할 데이터 : ", row);

      const headerQuery = headers.join(', ');
      const placeholders = headers.map(() => '?').join(', ');
      const sql = `INSERT INTO student (student_pk, created_at, ${headerQuery}) VALUES (UUID(), NOW(), ${placeholders})`;
      console.log("만들어진 쿼리 : "+sql);
      console.log("헤더 쿼리 : "+headerQuery);
      console.log("물음표 쿼리 : "+placeholders);
      await query(sql, row);
    }

    res.send('적용 완료');
  } catch (error) {
    console.error("에러 발생 : ", error);
    res.status(500).send('에러 발생');
  }
});


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
    baseQuery += " WHERE deleted_at IS NULL" + whereClauses.join(" AND ");
  }

  return {
    query: baseQuery,
    params: queryParams,
  };
}

/////////////////////학생조회
router.post("/server/students_view", checkAuthenticated("students_view"), async (req, res) => {
  console.log("학생 조회가 실행되었음");

  // student 테이블과 school 테이블을 조인하여 필요한 데이터를 가져옴
  const query = `
    SELECT 
      s.*, 
      sc.name AS school_name 
    FROM 
      student s 
    JOIN 
      school sc 
    ON 
      s.school = sc.school_pk 
    WHERE 
      s.deleted_at IS NULL
    ORDER BY
      s.name ASC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.log("학생 조회에서 오류 발생");
      console.log("-------------------에러 코드 -------------------");
      console.log(error);
      console.log("----------------------------------------------");
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, students: results });
      adminLog(req.session.user, "전체 학생 목록을 조회했습니다.");
    }
  });
});

//////////////////////학생 검색
router.post("/server/students_search", checkAuthenticated("students_search"), async (req, res) => {
  const { search } = req.body;
  console.log(search);

  let query = "";
  let queryParams = [];

  if (search.text === "") {
    query = "SELECT * FROM student WHERE deleted_at IS NULL;";
  } else {
    // 특정 조건에 맞는 데이터를 가져옴
    query = `SELECT * FROM student WHERE ${search.option} = ? AND deleted_at IS NULL;`;
    queryParams = [search.text];
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, datas: results, search: search });
      const logMsg = "학생 목록을 검색했습니다.";
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////학생 자세히 보기
router.post("/server/students_view_detail", checkAuthenticated("students_view_detail"), async (req, res) => {
  const { student_pk } = req.body;
  const query = `
  SELECT 
      s.student_pk,
      s.name,
      s.sex_ism,
      s.grade,
      s.birthday,
      s.contact,
      s.contact_parent,
      sc.name AS school,
      s.payday,
      s.firstreg,
      s.is_enable,
      s.created_at,
      s.updated_at,
      s.deleted_at
  FROM 
      student s
  JOIN 
      school sc 
  ON 
      s.school = sc.school_pk
  WHERE 
      s.deleted_at IS NULL
  ORDER BY 
      s.name ASC;
  `;
  db.query(query, [student_pk], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, students: results });
      const logMsg = "학생 자세히 보기를 했습니다. 학생 코드 : " + student_pk;
      adminLog(req.session.user, logMsg);
    }
  });
});

///////학생추가 페이지 로드
router.post("/server/students_addPage", checkAuthenticated("students_addPage"), async (req, res) => {
  db.query("SELECT school_pk, name FROM school WHERE deleted_at IS NULL", (error, results_school) => {
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
router.post("/server/students_add", checkAuthenticated("students_add"), async (req, res) => {
  const { name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg } = req.body;

  // 데이터 삽입 쿼리
  const query =
    "INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, (SELECT school_pk FROM school WHERE name = ?), ?, ?, NOW());";

  // 데이터베이스에 쿼리 실행
  db.query(query, [name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("사용자가 성공적으로 등록되었습니다.");
    const logMsg = "새로운 학생을 추가했습니다. 이름 : " + name + ", 전화번호 : " + contact;
    adminLog(req.session.user, logMsg);
  });
});

/////////////학생 추가 (여러명)
router.post("/server/students_add_multiple", checkAuthenticated("students_add_multiple"), async (req, res) => {
  const studentsData = req.body.DataStudents;
  console.log(studentsData);

  // 데이터 삽입 쿼리
  const query =
    "INSERT INTO student (student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
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
    db.query(query, values, async (err, result) => {
      if (err) {
        console.error("데이터 삽입 중 오류 발생:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
    });
  });

  res.status(200).send("사용자가 성공적으로 등록되었습니다.");
  adminLog(req.session.user, "여러 명의 학생 정보를 추가했습니다.");
});

//////////////////////학생 정보 수정
router.put("/server/students_view_update", checkAuthenticated("students_view_update"), async (req, res) => {
  const { student_pk, name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg } = req.body;

  const query = `UPDATE student SET name = ?, sex_ism = ?, birthday = ?, contact = ? ,contact_parent = ?, school = (SELECT school_pk FROM school WHERE name = ?), payday = ?, firstreg = ?, updated_at = NOW() WHERE student_pk = ?`;

  db.query(
    query,
    [name, sex_ism, birthday, contact, contact_parent, school, payday, firstreg, student_pk],
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true });
        adminLog(req.session.user, "학생 정보를 수정했습니다. 학생 코드 : " + student_pk);
      }
    }
  );
});

//////////////////////학생 정보 수정 (여러개 한번에)
router.post("/server/students_view_update_all", checkAuthenticated("students_view_update_all"), async (req, res) => {
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
      adminLog(req.session.user, "여러 명의 학생 정보를 수정했습니다.");
    }
  });
});

//학생 삭제
router.post("/server/student_remove", checkAuthenticated("student_remove"), async (req, res) => {
  const { id } = req.body;

  // 데이터 삽입 쿼리
  const query = "UPDATE student SET deleted_at = NOW() WHERE student_pk = ?";

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

/////////////////////학생-과목 조회
router.post("/server/student_subjects_view", checkAuthenticated("student_subjects_view"), async (req, res) => {
  console.log("학생-과목 조회가 실행되었음");

  const { subjectId } = req.body;

  if (!subjectId) {
    return res.status(400).json({ success: false, message: "subject_id가 필요합니다." });
  }

  const query = `
    SELECT 
      student_id AS student_pk
    FROM 
      student_subject
    WHERE 
      subject_id = ?
  `;

  db.query(query, [subjectId], (error, results) => {
    if (error) {
      console.log("학생-과목 조회에서 오류 발생");
      console.log("-------------------에러 코드 -------------------");
      console.log(error);
      console.log("----------------------------------------------");
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      const studentIds = results.map((row) => row.student_pk);
      res.json({ success: true, student_ids: studentIds });
      adminLog(req.session.user, `${subjectId} 과목의 학생 목록을 조회했습니다.`);
    }
  });
});


//----------------------------------출석-----------------------------------------------------

//////////////////////학생 출석 상태 검색
router.post("/server/students_attend", checkAuthenticated("students_attend"), async (req, res) => {
  const { search } = req.body;
  console.log(search);

  let query = "";
  let queryParams = [];

  if (search.text === "") {
    query = "SELECT * FROM student_executed_attenders;";
  } else {
    // 특정 조건에 맞는 데이터를 가져옴
    query = `SELECT * FROM student_executed_attenders WHERE ${search.option} = ?`;
    queryParams = [search.text];
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, datas: results, search: search });
      const logMsg = "학생 출석 상태를 검색했습니다.";
      adminLog(req.session.user, logMsg);
    }
  });
});

module.exports = {
  router: router,
};
