//등하원, 접근기록 등등

const db = require('./db');
const express = require("express");
const router = express.Router();



//등하원기록
function logAttend(qrcode, is_attend, is_late, now)
{
    
    
    // 결과 날짜를 YYYY-MM-DD 형식으로 변환합니다.
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
    const dd = String(now.getDate()).padStart(2, '0');
    
    const time = `${yyyy}-${mm}-${dd}`;




    const query = "INSERT INTO attend_log (attend_log_pk, student, time, is_attend, is_late) VALUES (UUID(), ?, ?, ?, ?)";

          db.query(
            query,
            [qrcode, time, is_attend, is_late],
            (err, result) => {
              if (err) {
                console.error("데이터 삽입 중 오류 발생:", err);
                res.status(500).send("서버 오류가 발생했습니다.");
                return;
              }
              res.status(200).send("로그 완료");
            }
          );

          

}

//출퇴근기록
function logAttend_teacher(qrcode, is_attend, now)
{
    
    
    // 결과 날짜를 YYYY-MM-DD 형식으로 변환합니다.
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
    const dd = String(now.getDate()).padStart(2, '0');
    
    const time = `${yyyy}-${mm}-${dd}`;




    const query = "INSERT INTO attend_log (teacher_attend_log_pk, teacher, time, is_attend) VALUES (UUID(), ?, ?, ?)";

          db.query(
            query,
            [qrcode, time, is_attend, is_late],
            (err, result) => {
              if (err) {
                console.error("데이터 삽입 중 오류 발생:", err);
                res.status(500).send("서버 오류가 발생했습니다.");
                return;
              }
              res.status(200).send("로그 완료");
            }
          );

          

}



//관리접근기록
function adminLog(teacher_pk, log)
{
  let now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
  const dd = String(now.getDate()).padStart(2, '0');
  const time = `${yyyy}-${mm}-${dd}`;


  const query = "INSERT INTO admin_log (admin_log_pk, teacher, time, log) VALUES (UUID(), ?, ?, ?)";

  db.query(
    query,
    [qrcode, time, is_attend, is_late],
    (err, result) => {
      if (err) {
        console.error("데이터 삽입 중 오류 발생:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
      res.status(200).send("로그 완료");
    }
  );





}





module.exports = {
  router: router,
  logAttend: logAttend,
  adminLog: adminLog
};