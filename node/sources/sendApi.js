const db = require('./db');
const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');
const axios = require('axios');
const { adminLog } = require('./logger');
let setPrenoteDay = 2; //결제일 며칠 전에 알림을 보낼 것인가




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
