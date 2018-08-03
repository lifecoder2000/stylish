const express = require('express');
const router = express.Router();
const jsonfile = require('jsonfile');
const Informations = require('../database/Informations');

/* 기본 페이지 랜더링 */
router.get('/', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('index', {user_id : req.session.user_id}); }
});

router.get('/product', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('product', {user_id : req.session.user_id}); }
});

router.get('/cart', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('cart', {user_id : req.session.user_id}); }
});

router.get('/blog', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('blog', {user_id : req.session.user_id}); }
});

router.get('/about', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('about', {user_id : req.session.user_id}); }
});

router.get('/contact', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('contact', {user_id : req.session.user_id}); }
});

router.get('/customerCenter', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.render('customerCenter'); }
});

/* 회원가입 */
router.get('/join', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ return res.redirect('/join.html'); }
});

router.post('/join', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()){ return res.send(`<script>alert('아이디 또는 패스워드가 존재합니다.');location.href='/join';</script>`); }
    else{
        await Informations.create({
            name : req.body.name,
            id : req.body.id,
            pw : req.body.pw,
            phone_number : req.body.code+'-'+req.body.number2+'-'+req.body.number3,
            email : req.body.email+'@'+req.body.domain,
            address : req.body.address
        });
        return res.send(`<script>alert('회원가입 완료:)');location.href='/';</script>`);
    }
});

/* 로그인, 로그아웃 */
router.get('/login', (req, res) => {
    if(req.session.is_user_login == true){ res.send(`<script>alert('이미 로그인 되어있습니다.');location.href='/';</script>`); }
    else{ return res.redirect('/login.html'); }
});

router.post('/login', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()) { 
        req.session.is_user_login = true;
        req.session.user_id = req.body.id;
        res.send(`<script>alert('${req.body.id}님 stylish에 오신것을 환영합니다.');location.href='/';</script>`);
    }
    else{ return res.send(`<script>alert('아이디 또는 패스워드가 잘못되었습니다.');location.href='/';</script>`); }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    return res.send(`<script>alert('로그아웃 되었습니다.');location.href='/';</script>`);
});

module.exports = router;