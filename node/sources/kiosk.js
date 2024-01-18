//등하원 키오스크 관련 모든 것
const db = require('./main');
const express = require("express");
const router = express.Router();
const axios = require("axios");
const logAttend = require('./logger');





/////키오스크에서 학생키를 받은 경우
router.post("/Kiosk_getStudent", (req, res) => {
    const { qrcode } = req.body;
    db.query(
      "SELECT * FROM student WHERE student_pk = ?",
      [qrcode],
      (err, results) => {
        if (err) {
          res.status(500).json({ success: false, message: "서버에러" });
          return;
        }
  
        if (results.length > 0) {
          const name = results[0].name;
          const birthday = results[0].birthday;
          const contact_parent = results[0].contact_parent;
          res.json({
            success: true,
            name: name,
            birthday: birthday,
            contact_parent: contact_parent,
          });
        } else {
          res.json({ success: false, message: "없는 ID입니다." });
        }
      }
    );
  });


/////문자API 전송 요청
router.post("/submitAttend", (req, res) => {
    const { qrcode, name, contact_parent, is_Attend } = req.body;
    let now = new Date();
    let msg = name + "학생이  "+ now.getHours()+"시 "+now.getMinutes()+"분에 ";
    if (is_Attend) {
      msg = msg + "등원하였습니다.";
    } else{
      msg = msg + "하원하였습니다.";
    }
    try {
      const response = axios.post("http://localhost:5100/input", {
        msg,
        contact_parent,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    //is_Late는 수업 관리 완성 후 기능 구현 때 사용

    logAttend(qrcode, is_Attend, is_Late);



  });


  module.exports = router;