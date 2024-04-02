const db = require('./db');
const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');
const axios = require('axios');
const { adminLog } = require('./logger');
let setPrenoteDay = 2; //결제일 며칠 전에 알림을 보낼 것인가


app.get('/server/sendtest', (req, res) => {
  const receiver = req.query.receiver;
  const msg = req.query.msg;
  send(receiver, msg);
  res.send(`받은 수신자 연락처 : ${receiver}, 받은 메세지 : ${msg}
  알리고 컨테이너로 값을 전송했습니다.`);
});


async function send(receiver, Msg){
  try {
      const response = await axios.post("http://localhost:5003", {receiver, Msg});
      console.log('서버로부터의 응답:', response.data);
  } catch (error) {
      console.error('에러 발생:', error);
  }
}

async function sendMass(receiver, Msg){
  try {
      const response = await axios.post("http://localhost:5003", {receiver, Msg});
      console.log('서버로부터의 응답:', response.data);
  } catch (error) {
      console.error('에러 발생:', error);
  }
}


module.exports = {
  router: router,
  send: send,
  sendMass: sendMass
};
