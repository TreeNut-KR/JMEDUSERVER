require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// CORS 설정: React 애플리케이션 주소 허용
const corsOptions = {
    origin: 'http://localhost:5001', // React 앱이 실행 중인 주소
    optionsSuccessStatus: 200
};
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
    console.log('Connected to the MySQL server.');
});

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

////////////////////로그인
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM teacher WHERE id = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server error' });
            return;
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].pwd, (err, isMatch) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Server error' });
                    return;
                }

                if (isMatch) {
                    req.session.user = results[0];
                    res.json({ success: true, message: 'Login successful' });
                } else {
                    res.json({ success: false, message: 'Incorrect username or password' });
                }
            });
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
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