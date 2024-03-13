//로그인, 로그아웃, 세션
//const db = require('./main');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require('cookie-parser');
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

let logoutTime = 60;

//로그인 라우트
router.post('/server/login', (req, res) => {
  console.log("@@@로그인 라우트 실행");
  const { username, password } = req.body;
  db.query('SELECT * FROM teacher WHERE id = ?', async [username], (err, results) => {
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
                  res.json({ success: false, message: '비밀번호가 일치하지 않습니다.'});
              }
          });
      } else {
          res.json({ success: false, message: '없는 ID입니다.'});
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
          "INSERT INTO teacher (teacher_pk, name, id, pwd, sex_ism, birthday, contact, is_admin) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)";
  
        // 데이터베이스에 쿼리 실행
        db.query(
          query,
          [name, id, hashedPassword, sex_bool, birthday, contact, is_admin],
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
  function checkAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        const user = req.session.user;



        db.query('SELECT * FROM teacher WHERE id = ?', [user.id], (err, results) => {
          if (err) {
              res.status(500).json({ success: false, message: '서버에러'});
              return;
          }
          if (results.length > 0) {
            if(results[0].is_admin){
              next();
            }else {
              res.status(401).json({ success: false, message: '권한이 없습니다.'});
            }


          } else {
              res.json({ success: false, message: '잘못된 접근입니다.'});
          }
      });
    } else {
        // 사용자 정보가 세션에 없으면 로그인하지 않았다고 판단하고 접근 거부
        res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }
}



function getUsername(req) {//사용자 이름을 반환
  if (req.session && req.session.user) {
      const user = req.session.user;

      return user.name;
  } else {
      return '';
  }
}


// 대시보드 라우트
router.get("/server/getusername", (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;

    res.json({ success: true, name: user.id });
} else {
  res.json({ success: true, name: ''});;
}
});
  

// 대시보드 라우트
router.get("/server/dashboard", (req, res) => {
    if (req.session.user) {
      res.send("Welcome to your dashboard, " + req.session.user.username);
    } else {
      res.redirect("/server/login");
    }
  });
  
  // 로그아웃 라우트
  router.get("/server/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/server/login");
  });



  // 3분마다 실행
function updateLogoutTime() {
  db.query("SELECT * FROM config WHERE config_pk = 0", (error, results) => {
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
