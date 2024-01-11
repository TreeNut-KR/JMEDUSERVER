//공지

const db = require('./main');
const express = require("express");
const router = express.Router();


//조건부 공지
router.post("/conditional_note", async (req, res) => { // 여기에 async 추가
    let query = makeStudentSearchQuery(req.body);
    db.query(query, async (error, results) => { // 만약 여기서도 await를 사용한다면 async 추가
      if (error) {
        res.status(500).json({ success: false, message: "데이터베이스 오류" });
      } else {
        for (var i = 0; i < results.length; i++) {
            try {
                const contact_parent = results[i].contact_parent;
                const name = results[i].name;
                const response = await axios.post("http://localhost:5100/input", {
                    contact_parent,
                    name,
                    msg,
                });
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        res.json({ success: true, message: 완료 });
      }
    });
});




module.exports = router;