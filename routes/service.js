var express = require('express');
var router = express.Router();

/* 데모 페이지 */
router.get('/demo', (req, res) => {
    res.render('demo');
});

router.post('/demo', (req, res) => {
    console.log(req.body);
    console.log(req.body.high+'\n'+req.body.weight);
    let msg = '키 : '+req.body.high+' 몸무게 : '+req.body.weight;
    return res.send({result:true, msg:msg});
});

router.get('/', (req, res) => {
    res.send(`${req.session.user_id}님 환영합니다.`);
});

module.exports = router;