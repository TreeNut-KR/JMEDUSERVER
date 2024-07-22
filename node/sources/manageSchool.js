const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("./permission");
const { logAttend, adminLog } = require("./logger");

/////////////////////학교조회
router.post("/server/school/view", checkAuthenticated("schools_view"), async (req, res) => {
  const { is_elementary, is_middle, is_high } = req.body;

  db.query("SELECT * FROM school", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, school: results });
      adminLog(req.session.user, "학교 목록을 조회했습니다.");
    }
  });
});

//////////////////////학교 자세히 보기
router.post("/server/schools_view_detail", checkAuthenticated("schools_view_detail"), async (req, res) => {
  const { school_pk } = req.body;
  db.query("SELECT * from school WHERE school_pk = ? AND deleted_at IS NULL;", [school_pk], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, schools: results });
      const logMsg = "학교 자세히 보기를 했습니다. 학교 코드 : " + school_pk;
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////학교 검색
router.post("/server/schools_search", checkAuthenticated("schools_search"), async (req, res) => {
  const { search } = req.body;
  console.log(search);

  let query = "";
  let queryParams = [];

  if (search.text === "") {
    query = "SELECT * FROM school WHERE deleted_at IS NULL;";
  } else {
    // 특정 조건에 맞는 데이터를 가져옴
    query = `SELECT * FROM school WHERE ${search.option} = ?`;
    queryParams = [search.text];
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, datas: results, search: search });
      const text = search.text ? search.text : "전체";
      const logMsg = `학교 목록을 검색했습니다. 검색 명 : ${text}`;
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////학교 정보 수정 (여러개 한번에)
router.post("/server/schools_view_update_all", checkAuthenticated("schools_view_update_all"), async (req, res) => {
  const { editObject, editTarget } = req.body;

  let query;

  if (editObject.option === "remove") {
    query = `DELETE FROM school WHERE school_pk IN (${editTarget})`;
  } else {
    query = `UPDATE school SET ${editObject.option} = '${editObject.text}' WHERE school_pk IN (${editTarget})`;
  }
  console.log("editobject:", editObject, "쿼리 : ", query);
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true });
      if (editObject.option === "remove") adminLog(req.session.user, "다수의 학교 정보를 제거했습니다. ");
      adminLog(req.session.user, "다수의 학교 정보를 수정했습니다.");
    }
  });
});

//////////////////////학교 정보 수정
router.put("/server/schools_view_update", checkAuthenticated("schools_view_update"), async (req, res) => {
  const { school_pk, name, elementary, middle, high } = req.body;

  const query = `UPDATE school SET name = ?, is_elementary = ?, is_middle = ?, is_high = ? WHERE school_pk = ?`;

  db.query(query, [name, elementary, middle, high, school_pk], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true });
      adminLog(req.session.user, "학교 정보를 수정했습니다. 학생 코드 : " + school_pk);
    }
  });
});

//////////////학교추가
router.post("/server/school/add", checkAuthenticated("school_add"), async (req, res) => {
  const { name, elementary, middle, high } = req.body;

  const query = "INSERT INTO school (name, is_elementary, is_middle, is_high) VALUES (?, ?, ?, ?)";

  try {
    // 데이터베이스에 쿼리 실행
    db.query(query, [name, elementary, middle, high]);
    res.status(200).json({ success: true, message: "학교가 성공적으로 등록되었습니다." });
    adminLog(req.session.user, "학교를 추가했습니다. 학교 이름 : " + name);
  } catch (err) {
    console.error("데이터 삽입 중 오류 발생:", err);
    console.log("오류 발생:",err);
    res.status(500).send("데이터베이스 오류가 발생했습니다.");
  }
});


//학교 수정
router.post("/server/school/update", checkAuthenticated("school_update"), async (req, res) => {
  const { name, is_elementary, is_middle, is_high, school_pk } = req.body;

  const query =
    "UPDATE school SET name = ?, is_elementary = ?, is_middle = ?, is_high = ?, updated_at = NOW() WHERE school_pk = ?";

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
      const logMsg =
        "학교 정보를 수정했습니다. 대상 학교 코드 : " +
        school_pk +
        ", 학교명 : " +
        name +
        ", 초등 : " +
        is_elementary +
        ", 중학 : " +
        is_middle +
        ", 고등 : " +
        is_high;
      adminLog(rqq.session.user, logMsg);
    }
  });
});

/////////////////////기록조회
router.post("/server/log/view", checkAuthenticated("school_update"), async (req, res) => {
  db.query("SELECT * FROM admin_log", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, log: results });
      adminLog(req.session.user, "로그 조회했습니다.");
    }
  });
});

//학교 삭제
router.post("/server/school/remove", checkAuthenticated("school_remove"), async (req, res) => {
  const { id } = req.body;

  // 데이터 삽입 쿼리
  const query = "UPDATE school SET deleted_at = NOW() WHERE school_pk = ?;";

  // 데이터베이스에 쿼리 실행
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.status(200).send("학교 삭제 완료.");
    const logMsg = "학교 정보를 삭제했습니다. 학교 코드 : " + id;
    adminLog(req.session.user, logMsg);
  });
});

module.exports = {
  router: router,
};
