require("dotenv").config();
const express = require("express");
//const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql");
const cors = require("cors");
const app = express();


const auth = require('./auth');
const kiosk = require('./kiosk');
const logger = require('./logger');
const manageStudent = require('./manageStudent');
const manageSubject = require('./manageSubject');
const manageTeacher = require('./manageTeacher');
const notification = require('./notification');

// CORS 설정: 모든 출처 허용 (개발 단계에서만)
app.use(cors());

const saltRounds = 10;

// 데이터베이스 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log("@@@@@@Connected to the MySQL server.@@@@@@");
});

module.exports = db;

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



app.use(auth);
app.use(kiosk);
app.use(logger);
app.use(manageStudent);
app.use(manageSubject);
app.use(manageTeacher);
app.use(notification);


// 서버 시작
app.listen(5002, () => {
  console.log("Server is running on port 5002");
});
