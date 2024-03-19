//로그인, 로그아웃, 세션
//const db = require('./main');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db');
const {logAttend, adminLog } = require('./logger');

router.use(cookieParser());

router.use(session({
  secret: process.env.SESSION_SECRET,  // 세션을 암호화하기 위한 키
  resave: false,  // 세션을 항상 저장할지 여부를 정하는 값 (보통 false로 설정)
  saveUninitialized: true,  // 초기화되지 않은 세션을 스토어에 저장
  rolling: true,
  cookie: { secure: false }  // HTTPS를 사용하지 않는 경우 false로 설정
}));

// body-parser 미들웨어를 사용하여 application/json 요청을 파싱
router.use(bodyParser.json({ limit: '10mb', extended: true }));

// application/x-www-form-urlencoded 요청을 파싱
router.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));


let logoutTime = 60;

//로그인 라우트
router.post('/server/login', async(req, res) => {
  console.log("@@@로그인 라우트 실행");
  const { username, password } = req.body;
  db.query('SELECT * FROM teacher WHERE id = ?', [username], (err, results) => {
      if (err) {
          res.status(500).json({ success: false, message: '서버에러'});
          return;
      }
      if (results.length > 0) {
          bcrypt.compare(password, results[0].pwd, (err, isMatch) => {
              if (err) {
                  res.status(500).json({ success: false, message: '서버 에러입니다. 관리자에게 문의하십니오.'});
                  return;
              }
              if (isMatch) {
                
                  req.session.user = results[0];
                      // 쿠키 설정
                  res.cookie('userSession', username, {
                    httpOnly: true,
                    secure: false,  // HTTPS를 사용할 때만 활성화
                    maxAge: logoutTime * 6000  // 쿠키 유효기간 설정
                  });


                  
                  res.json({ success: true, message: '로그인 성공'});
              } else {
                  res.json({ success: false, message: '없는 ID입니다.'});
              }
          });
      } else {
          res.json({ success: false, message: '에러코드 503 : Park Geunhyae'});
      }
  });
});
  
  //////회원가입
  router.post("/server/register", async (req, res) => {
    const { name, id, pwd, sex_ism, birthday, contact, is_admin } = req.body;
    console.log("가입 요청 들어옴");
    const hashedPassword = await bcrypt.hash(pwd, 10); // 비밀번호 해싱
    let sex_bool;
    if(sex_ism == 'male')
    {
      sex_bool = true;
    }else sex_bool = false;
  
    db.query("SELECT * FROM teacher WHERE id = ?", [id], (err, results) => {
      if (results.length) {

        res.status(200).send("이미 사용중인 ID입니다.");
      } else {
        // 데이터 삽입 쿼리
        const query =
          "INSERT INTO teacher (teacher_pk, name, id, pwd, sex_ism, birthday, contact, admin_level) VALUES (UUID(), ?, ?, ?, ?, ?, ?, 0)";
  
        // 데이터베이스에 쿼리 실행
        db.query(
          query,
          [name, id, hashedPassword, sex_bool, birthday, contact],
          (err, result) => {
            if (err) {
              console.error("데이터 삽입 중 오류 발생:", err);
              res.status(500).send("서버 오류가 발생했습니다.");
              return;
            }
            res.status(200).send("가입 완료.");
          }
        );
      }
    });
  });
  
  //권한확인
  function checkAuthenticated(taskName) {
    return function(req, res, next) {
      if (req.session && req.session.user) {
        const user = req.session.user;
  
        db.query(
          "SELECT * from permissions WHERE task_name = ?;",
          [taskName],
          (error, results) => {
            if (error) {
              return res.status(503).json({ success: false, message: "데이터베이스 오류" });
            } else {
              if (results.length === 0) {
                return res.status(404).json({ success: false, message: "권한 설정을 찾을 수 없습니다." });
              }
              
              if (user.admin_level >= results[0].level) { 
                next();
              } else {
                res.status(403).json({ success: false, message: "접근 권한이 없습니다." });
              }
            }
          }
        );
      } else {
        res.status(401).json({ success: false, message: "인증되지 않았습니다." });
      }
    };
  }



function getUsername(req) {//사용자 이름을 반환
  if (req.session && req.session.user) {
      const user = req.session.user;

      return user.name;
  } else {
      return '';
  }
}


// 사용자 이름 반환
router.get("/server/getusername", async (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;

    res.json({ success: true, name: user.id });
} else {
  res.json({ success: true, name: ''});;
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
  checkAuthenticated: checkAuthenticated,
  getUsername: getUsername
};
