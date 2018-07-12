var express = require('express');
var router = express.Router();
var Informations = require('../database/Informations');

/* 회원가입 */
router.get('/join', (req, res) => {

});

/* 로그인, 로그아웃 */
router.get('/login', (req, res) => {
    if(req.session.is_user_login == true){
        res.send('you already logined:)');
    }else{
        res.render('user_auth');
    }
});

router.post('/login', async(req, res) => {
    let compare = await Informations.findOne({id:req.body.id, pw:req.body.pw});    
    if(compare) { 
        req.session.is_user_login = true;
        res.send(`<script>alert('${req.body.id}님 stylish에 오신것을 환영합니다.');location.href='/';</script>`);
    }else{
        res.send(`<script>alert('아이디 또는 패스워드가 잘못되었습니다.');location.href='/';</script>`);
    }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});

/* 마이페이지 */
router.get('/mypage', (req, res) => {

});

module.exports = router;