const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 5001;

// pool을 전역 변수로 정의
var pool;

app.get('/', (req, res) => res.send('HI NODEJS'));

app.get('/health', (req, res) => {
    // if (!pool)를 제거하고 바로 pool을 정의
    pool = mysql.createPool({
        host: "docker-mysql",
        user: "root",
        password: "1234",
        database: "joinc",
        port: 3306
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.send(err.message);
        } else {
            connection.release();
            res.send("db connection success");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});