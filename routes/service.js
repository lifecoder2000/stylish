const express = require('express');
const router = express.Router();
const QuestionAnswer = require('../database/QeustionAnswer');

/* 데모 페이지 */
router.get('/demo', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ res.render('demo'); }
});

router.post('/demo', (req, res) => {
    let msg = '키 : '+req.body.high+' 몸무게 : '+req.body.weight;
    return res.send({result:true, msg:msg});
});

/* 1:1상담 */
router.get('/consulting', (req, res) => {
    console.log('asdf');
    
    res.io.emit("socketToMe", "service");
    res.render('consulting');
});

router.post('/consulting', (req, res) => {

});

/* Q & A */
router.get('/Q&A', (req, res) => {
    res.render('questionAndAnswer');
});

router.post('/Q&A', async(req, res) => {
    await QuestionAnswer.create({
        writer : req.body.id,
        text : req.body.text,
        status : false
    });
    return res.send(`<script>alert('질문이 등록되었습니다.');location.href='/customerCenter'</script>`);
});

module.exports = router;