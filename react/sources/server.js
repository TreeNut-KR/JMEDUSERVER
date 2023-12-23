const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');

const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql', // Docker 컨테이너 이름으로 변경
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'jmedu'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/getStudents', function(req, res) {
    let sql = 'SELECT * FROM student';
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.json(results);
        }
    });
});

// public 디렉토리의 파일들을 제공합니다.
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(5001, function() {
    console.log('Server is listening on port 5001');
});