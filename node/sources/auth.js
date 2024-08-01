//로그인, 로그아웃, 세션
//const db = require('./main');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { checkAuthenticated } = require("./permission");
const db = require("./db");
const { logAttend, adminLog } = require("./logger");

router.use(cookieParser());

let logoutTime = 60;
router.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션을 암호화하기 위한 키
    resave: false, // 세션을 항상 저장할지 여부를 정하는 값 (보통 false로 설정)
    saveUninitialized: true, // 초기화되지 않은 세션을 스토어에 저장
    rolling: true,
    cookie: {
      secure: false,
      HttpOnly: false,
      maxAge: 1000 * 60 * logoutTime,
    },
    name: "jmedusession",
  })
);

// body-parser 미들웨어를 사용하여 application/json 요청을 파싱
router.use(bodyParser.json({ limit: "10mb", extended: true }));

// application/x-www-form-urlencoded 요청을 파싱
router.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));

//로그인 라우트
router.post("/server/login", async (req, res) => {
  console.log("@@@로그인 라우트 실행");
  const { username, password } = req.body;
  db.query("SELECT * FROM teacher WHERE id = ?", [username], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: "서버에러" });
      return;
    }
    if (results.length > 0) {
      bcrypt.compare(password, results[0].pwd, (err, isMatch) => {
        if (err) {
          res.status(500).json({ success: false, message: "서버 에러입니다. 관리자에게 문의하십니오." });
          return;
        }
        if (isMatch) {
          req.session.user = { username: results[0].id, admin_level: results[0].admin_level };
          res.json({ success: true, message: "로그인 성공" });
        } else {
          res.json({ success: false, message: "비밀번호가 일치하지 않습니다." });
        }
      });
    } else {
      res.json({ success: false, message: "없는 ID입니다." });
    }
  });
});

//////회원가입
router.post("/server/register", async (req, res) => {
  const { name, id, pwd, sex_ism, birthday, contact, is_admin } = req.body;
  console.log("가입 요청 들어옴");
  const hashedPassword = await bcrypt.hash(pwd, 10); // 비밀번호 해싱
  let sex_bool;
  if (sex_ism == "male") {
    sex_bool = true;
  } else sex_bool = false;

  db.query("SELECT * FROM teacher WHERE id = ?", [id], (err, results) => {
    if (results.length) {
      res.status(200).send("이미 사용중인 ID입니다.");
    } else {
      // 데이터 삽입 쿼리
      const query =
        "INSERT INTO teacher (teacher_pk, name, id, pwd, sex_ism, birthday, contact, admin_level) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 0)";

      // 데이터베이스에 쿼리 실행
      db.query(query, [name, id, hashedPassword, sex_bool, birthday, contact], (err, result) => {
        if (err) {
          console.error("데이터 삽입 중 오류 발생:", err);
          res.status(500).send("서버 오류가 발생했습니다.");
          return;
        }
        res.status(200).send("가입 완료.");
      });
    }
  });
});



function getUsername(req) {
  //사용자 이름을 반환
  if (req.session && req.session.user) {
    const user = req.session.user;

    return user.name;
  } else {
    return "";
  }
}

// 사용자 이름 반환
router.get("/server/getusername", async (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;

    res.json({ success: true, name: user.id });
  } else {
    res.json({ success: true, name: "" });
  }
});

// 대시보드 라우트
router.get("/server/dashboard", async (req, res) => {
  if (req.session.user) {
    res.send("Welcome to your dashboard, " + req.session.user.username);
  } else {
    res.redirect("/server/login");
  }
});

// 로그아웃 라우트
router.get("/server/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/server/login");
});


// 작업별 요구레벨 불러오기
router.get("/server/admin_permissions", checkAuthenticated("admin_permissions"), async (req, res) => {
  db.query("SELECT * FROM permissions", (error, results) => {
    console.log("퍼미션 조회");
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, teachers: results });
    }
  });
});


// 작업별 요구권한 수정
router.post("/server/admin_permissions", checkAuthenticated("admin_permissions"), async (req, res) => {
  const { task_name, level } = req.body;

  const query = `UPDATE permissions SET level = ? WHERE task_name = ?`;

  db.query(
    query,
    [level, task_name],
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true });
        adminLog(req.session.user, "권한 정보를 수정했습니다.");
      }
    }
  );
});


//선생 권한 받아오기
router.get("/server/user_permissions", checkAuthenticated("admin_permissions"), async (req, res) => {
  db.query("SELECT teacher_pk, name, admin_level FROM teacher", (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: "데이터베이스 오류" });
    } else {
      res.json({ success: true, teachers: results });
    }
  });
});

//선생 권한 수정
router.post("/server/user_permissions", checkAuthenticated("admin_permissions"), async (req, res) => {
  const { teacher_pk, admin_level } = req.body;  // 클라이언트로부터 admin_level을 받습니다.

  const query = `UPDATE teacher SET admin_level = ? WHERE teacher_pk = ?`;

  db.query(
    query,
    [admin_level, teacher_pk],  // 올바르게 admin_level을 사용합니다.
    (error, results) => {
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        res.json({ success: true });
        adminLog(req.session.user, "권한 정보를 수정했습니다.");
      }
    }
  );
});


// 3분마다 실행
function updateLogoutTime() {
  db.query("SELECT * FROM serverconf WHERE config_pk = 0", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      logoutTime = results[0].logout_time;
    }
  });
}

// 3분은 밀리세컨드로 환산하면 180000ms입니다.
setInterval(updateLogoutTime, 180000);

module.exports = {
  router: router,
  // checkAuthenticated: checkAuthenticated,
  getUsername: getUsername,
};
