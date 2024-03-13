//공지

const db = require('./db');
const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');
const axios = require('axios');
const { checkAuthenticated } = require('./auth');
const {logAttend, adminLog } = require('./logger');
let setPrenoteDay = 2; //결제일 며칠 전에 알림을 보낼 것인가




async function sendArryToAPIserver(data, sendTo) {
    const url = 'http://localhost:5100'+sendTo; // 서버의 URL

    try {
        const response = await axios.post(url, data);
        console.log('서버로부터의 응답:', response.data);
    } catch (error) {
        console.error('에러 발생:', error);
    }
}


function getNeedPaynote(){//결제일이 며칠인 학부모에게 보내면 되나요? 에 대한 값을 리턴
    
    const today = new Date();
    new Date(today.getTime() + setPrenoteDay * 86400000);
    return String(threeDaysLater.getDate()).padStart(2, '0');
}

//조건부 공지
router.post("/server/conditional_note", async (req, res) => { // 여기에 async 추가
    let query = makeStudentSearchQuery(req.body);
    db.query(query, async (error, results) => { // 만약 여기서도 await를 사용한다면 async 추가
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        for (var i = 0; i < results.length; i++) {
            try {
                const contact_parent = results[i].contact_parent;
                const name = results[i].name;
                const response = await axios.post("http://localhost:5100/input", {
                    contact_parent,
                    msg,
                });
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        res.json({ success: true, message: 완료 });
      }
    });
});

//결제일 미리알림

// 매일 오전 11시에 실행
function paydayNotification(){
    const needPayNote = parseInt(getNeedPaynote());
    let nameArray = [];
    let contact_parentArray = [];

    db.query("SELECT * FROM teacher WHERE payday = ?", [needPayNote], (err, results) => {


        for(var i = 0; i<results.length;i++){
            nameArray.push(results[i].name);
            contact_parentArray.push(results[i].contact_parent);

        }        
        res.json({ success: true, message: "수신 성공" });
    });

    sendArryToAPIserver(nameArray, '/paynote_name');
    sendArryToAPIserver(contact_parentArray, '/paynote_contact');
}







// 스케줄 정의 (매일 11시)
const job = schedule.scheduleJob('0 11 * * *', paydayNotification);




module.exports = {
    router: router
  };
  