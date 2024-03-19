const express = require('express');
const app = express();
const port = 5004;

// 'public' 폴더 안의 파일들을 정적 파일로 제공합니다.
// CSS, JS, 이미지 파일들은 이 폴더 안에 위치해야 합니다.
app.use(express.static('public'));

// 루트 URL ('/server/')에 대한 요청을 처리합니다.
app.get('/server/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});