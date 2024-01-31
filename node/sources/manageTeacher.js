//교직원 추가, 수정, 삭제

const db = require('./db');
const express = require("express");
const router = express.Router();
const {logAttend, adminLog } = require('./logger');







module.exports = {
    router: manageTeacherRouter
  };
  