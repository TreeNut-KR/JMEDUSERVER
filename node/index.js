require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// CORS 설정: 모든 출처 허용 (개발 단계에서만)
app.use(cors());

const saltRounds = 10;

// 데이터베이스 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('@@@@@@Connected to the MySQL server.@@@@@@');
});

// 미들웨어 설정
app.use(bodyParser.json()); // JSON 본문 처리
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// 로그인 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM teacher WHERE id = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: '서버에러'});
            return;
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].pwd, (err, isMatch) => {
                if (err) {
                    res.status(500).json({ success: false, message: '서버 에러'});
                    return;
                }

                if (isMatch) {
                    req.session.user = results[0];
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
app.post('/register', (req, res) => {
    const { name, id, pwd, sex_ism, birthday, contact, is_admin } = req.body;
  
    // 데이터 삽입 쿼리
    const query = 'INSERT INTO teacher (teacher_pk, name, id, pwd, sex_ism, birthday, contact, is_admin) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)';
  
    // 데이터베이스에 쿼리 실행
    db.query(query, [name, id, pwd, sex_ism, birthday, contact, is_admin], (err, result) => {
      if (err) {
        console.error('데이터 삽입 중 오류 발생:', err);
        res.status(500).send('서버 오류가 발생했습니다.');
        return;
      }
      res.status(200).send('사용자가 성공적으로 등록되었습니다.');
    });
  });



/////////////////////학생조회
app.get('/student_view', (req, res) => {
    // 'student' 테이블의 모든 데이터를 조회
    db.query('SELECT * FROM student', async (error, results, fields) => {
        if (error) throw error;

        try {
            // POST 요청으로 데이터 전송
            const response = await axios.post('react:5001', results);
            res.send('Data sent successfully: ' + response.data);
        } catch (error) {
            res.status(500).send('Error sending data: ' + error.message);
        }
    });
});


app.post('/student_edit', (req, res) => {

});




// 대시보드 라우트
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send('Welcome to your dashboard, ' + req.session.user.username);
    } else {
        res.redirect('/login');
    }
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// 서버 시작
app.listen(5002, () => {
    console.log('Server is running on port 5002');
});