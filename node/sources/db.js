const mysql = require("mysql");
const express = require("express");

// 데이터베이스 설정
const db = mysql.createConnection({
    host: process.env.MYSQL_ROOT_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8mb4'
  });
  
  db.connect((err) => {
    if (err) throw err;

    
    console.log("@@@@@@Connected to the MySQL server.@@@@@@");
  });
  
  module.exports = db;