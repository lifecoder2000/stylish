const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Informations = require('../database/Informations');
const ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');
const stock = require('../config/stock');

/* 기본 페이지 */
router.get('/', (req, res) => {
    console.log('stock:'+stock.cloths);
    res.render('index', {user_id : req.session.user_id});
});

router.get('/product', (req, res) => {
    res.render('product', {user_id : req.session.user_id});
});

router.get('/cart', (req, res) => {
    res.render('cart', {user_id : req.session.user_id});
});

router.get('/blog', (req, res) => {
    res.render('blog', {user_id : req.session.user_id});
});

router.get('/about', (req, res) => {
    res.render('about', {user_id : req.session.user_id});
});

router.get('/contact', (req, res) => {
    res.render('contact', {user_id : req.session.user_id});
});

/* 회원가입 */
router.get('/join', (req, res) => {
    return res.redirect('/join.html');
});

router.post('/join', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()){
        return res.send(`<script>alert('아이디 또는 패스워드가 존재합니다.');location.href='/join';</script>`);
    }else{
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
    if(req.session.is_user_login == true){
        res.send(`<script>alert('이미 로그인 되어있습니다.');location.href='/';</script>`);
    }else{
        res.redirect('/login.html');
    }
});

router.post('/login', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()) { 
        req.session.is_user_login = true;
        req.session.user_id = req.body.id;
        res.send(`<script>alert('${req.body.id}님 stylish에 오신것을 환영합니다.');location.href='/';</script>`);
    }else{
        res.send(`<script>alert('아이디 또는 패스워드가 잘못되었습니다.');location.href='/';</script>`);
    }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    return res.send(`<script>alert('로그아웃 되었습니다.');location.href='/';</script>`);
});

/* 이메일 보내기 */
router.post('/email', (req, res) => {
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : req.body.email,
            pass : req.body.password
        }
    });
    
    let mailOption = {
        from : req.body.email,
        to : ADMIN_ACCOUNT.email,
        subject : 'customer contact message',
        text : 'name:'+req.body.name+'\n'+'P.H:'+req.body.phone+'\n'+'message:'+req.body.message
    }

    transporter.sendMail(mailOption, (err, info) => {
        if(err){ 
            console.log(err);
            return res.send(`<script>alert('error');location.href='/contact';</script>`);
        }else{ 
            console.log('Message sent : ', info);
            return res.send(`<script>alert('success');location.href='/contact';</script>`);
        }
    });
});

module.exports = router;