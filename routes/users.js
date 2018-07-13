var express = require('express');
var router = express.Router();
var Informations = require('../database/Informations');

router.get('/', (req, res) => {
    res.send('태현아 안녕');
});

/* 회원가입 */
router.get('/join', (req, res) => {
    return res.render('join');
});

router.post('/join', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()){
        return res.send(`<script>alert('아이디 또는 패스워드가 존재합니다.');location.href='/user/join';</script>`)
    }else{
        await Informations.create({
            name : req.body.name,
            id : req.body.id,
            pw : req.body.pw,
            phone_number : req.body.phoneNumber,
            email : req.body.email,
            address : req.body.address
        });
        return res.send(`<script>alert('회원가입 완료.');location.href='/';</script>`)
    }
});

/* 로그인, 로그아웃 */
router.get('/login', (req, res) => {
    if(req.session.is_user_login == true){
        //사용자 페이지로 이동
        res.send('you already logined:)');
    }else{
        res.render('login');
    }
});

router.post('/login', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()) { 
        req.session.is_user_login = true;
        res.send(`<script>alert('${req.body.id}님 stylish에 오신것을 환영합니다.');location.href='/';</script>`);
    }else{
        res.send(`<script>alert('아이디 또는 패스워드가 잘못되었습니다.');location.href='/';</script>`);
    }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    return res.send(`<script>alert('로그아웃 되었습니다.');location.href='/';</script>`);
});

/* 마이페이지 */
router.get('/mypage', (req, res) => {

});

module.exports = router;