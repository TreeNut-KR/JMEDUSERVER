//로그인, 로그아웃, 세션
const db = require('./main');
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");


// 로그인 라우트
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    db.query("SELECT * FROM teacher WHERE id = ?", [username], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: "서버에러" });
        return;
      }
  
      if (results.length > 0) {
        if (password == results[0].pwd) {
          req.session.user = results[0];
          res.json({ success: true, message: "로그인 성공" });
        } else {
          res.json({
            success: false,
            message: `비밀번호가 일치하지 않습니다. 필요 pw : ${results[0].pwd} 입력 pw : ${password}`,
          });
        }
      } else {
        res.json({ success: false, message: "없는 ID입니다." });
      }
    });
  });
  
  //////회원가입
  router.post("/register", async (req, res) => {
    const { name, id, pwd, sex_ism, birthday, contact, is_admin } = req.body;
    console.log("가입 요청 들어옴");
    const hashedPassword = await bcrypt.hash(pwd, 10); // 비밀번호 해싱
  
    db.query("SELECT * FROM teacher WHERE id = ?", [username], (err, results) => {
      if (results.length) {
        res.status(200).send("이미 사용중인 ID입니다.");
      } else {
        // 데이터 삽입 쿼리
        const query =
          "INSERT INTO teacher (teacher_pk, name, id, pwd, sex_ism, birthday, contact, is_admin) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)";
  
        // 데이터베이스에 쿼리 실행
        db.query(
          query,
          [name, id, hashedPassword, sex_ism, birthday, contact, is_admin],
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
  
  

// 대시보드 라우트
router.get("/dashboard", (req, res) => {
    if (req.session.user) {
      res.send("Welcome to your dashboard, " + req.session.user.username);
    } else {
      res.redirect("/login");
    }
  });
  
  // 로그아웃 라우트
  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  });

  module.exports = router;