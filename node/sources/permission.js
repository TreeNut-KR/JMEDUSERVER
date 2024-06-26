
const express = require("express");
const db = require("./db");



//권한확인
function checkAuthenticated(taskName) {
  return function (req, res, next) {
    console.log("check함수 실행됨");
    if (req.session.user) {
      const user = req.session.user;

      db.query("SELECT * from permissions WHERE task_name = ?;", [taskName], (error, results) => {
        if (error) {
          console.log("---------- 권한 확인 쿼리에서 오류 발생 ---------");
          console.log(error);
          console.log("------------------------------------------");
          return res.status(503).json({ success: false, message: "데이터베이스 오류" });
        } else {
          if (results.length === 0) {
            console.log("권한 설정에 오류가 있음");
            return res.status(404).json({ success: false, message: "권한 설정을 찾을 수 없습니다." });
          }

          if (user.admin_level >= results[0].level) {
            next();
          } else {
            console.log("접근 권한이 없음");
            return res.status(403).json({ success: false, message: "접근 권한이 없습니다." });
          }
        }
      });
    } else {
      console.log("로그아웃 상태임");
      return res.status(401).json({ success: false, message: "로그아웃 상태입니다." });
    }
  };
}

module.exports = {
  checkAuthenticated: checkAuthenticated,
};
