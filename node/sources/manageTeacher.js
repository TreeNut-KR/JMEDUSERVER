//교직원 추가, 수정, 삭제

const db = require("./db");
const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("./auth");
const { logAttend, adminLog } = require("./logger");

/////////////////////강사조회
router.post("/server/teacher_view", checkAuthenticated("teacher_view"), async (req, res) => {
  db.query("SELECT * FROM teacher", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, teachers: results });
    }
  });
});

//////////////////////교사 검색
router.post("/server/teachers_search", checkAuthenticated("teachers_search"), async (req, res) => {
  const { search } = req.body;
  console.log(search);

  let query = "";
  let queryParams = [];

  if (search.text === "") {
    query = "SELECT * FROM teacher WHERE deleted_at IS NULL;";
  } else {
    query = `SELECT * FROM teacher WHERE ${search.option} = ? AND deleted_at IS NULL;`;
    queryParams = [search.text];
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, datas: results, search: search });
      const logMsg = "교사 목록을 검색했습니다.";
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////강사 정보 수정
router.put("/server/teacher_update", checkAuthenticated("teacher_update"), async (req, res) => {
  const { teacher_pk, name, sex_ism, birthday, contact, contact_parent, school, grade, payday, firstreg } = req.body;

  const query = `UPDATE teacher SET name = ?, sex_ism = ?, birthday = ?, contact = ?`;

  db.query(query, [name, sex_ism, birthday, contact], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true });
    }
  });
});

//////////////////////강사 자세히 보기
router.post("/server/teachers_view_detail", checkAuthenticated("teachers_view_detail"), async (req, res) => {
  const { teacher_pk } = req.body;
  console.log(teacher_pk);
  db.query("SELECT * from teacher WHERE teacher_pk = ?", [teacher_pk], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, teachers: results });
      const logMsg = "강사 자세히 보기를 했습니다. 강사 코드 : " + teacher_pk;
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////강사 검색
router.post("/server/teachers_search", checkAuthenticated("teachers_search"), async (req, res) => {
  const { search } = req.body; // 'search' 객체 추출
  console.log(search);
  const { query, params } = makeStudentSearchQuery(search.text, search.option);
  db.query(query, params, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, datas: results, search: search });
      const logMsg = "강사 목록을 검색했습니다.";
      adminLog(req.session.user, logMsg);
    }
  });
});

//////////////////////강사 정보 수정 (여러개 한번에)
router.post("/server/teachers_view_update_all", checkAuthenticated("teachers_view_update_all"), async (req, res) => {
  const { editObject, editTarget } = req.body;

  let query;

  if (editObject.option === "remove") {
    query = `DELETE FROM teacher WHERE teacher_pk IN (${editTarget})`;
  } else {
    query = `UPDATE teacher SET ${editObject.option} = '${editObject.text}' WHERE teacher_pk IN (${editTarget})`;
  }
  console.log("editobject:", editObject, "쿼리 : ", query);
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true });
      adminLog(req.session.user, "여러 명의 강사 정보를 수정했습니다.");
    }
  });
});

module.exports = {
  router: router,
};
