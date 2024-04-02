require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const app = express();


const { router: authRouter } = require('./auth');
const { router: kioskRouter } = require('./kiosk');
const { router: loggerRouter} = require('./logger');
const { router: manageSchoolRouter } = require('./manageSchool');
const { router: manageStudentRouter } = require('./manageStudent');
const { router: manageSubjectRouter } = require('./manageSubject');
const { router: manageTeacherRouter } = require('./manageTeacher');
const { router: notificationRouter } = require('./notification');
const { router: sendApi } = require('./sendApi');
const db = require('./db');

// CORS 설정: 모든 출처 허용 (개발 단계에서만)
app.use(cors({
  origin: true,
  credentials: true
}));

const saltRounds = 10;



// 미들웨어 설정
app.use(bodyParser.json()); // JSON 본문 처리
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);



app.use(authRouter);
app.use(kioskRouter);
app.use(loggerRouter);
app.use(manageSchoolRouter);
app.use(manageStudentRouter);
app.use(manageSubjectRouter);
app.use(manageTeacherRouter);
app.use(notificationRouter);
app.use(sendApi);


// 서버 시작
app.listen(5002, () => {
  console.log("서버가 5002번 포트에서 실행됩니다.");
});
