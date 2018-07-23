const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jsonfile = require('jsonfile');
const Informations = require('../database/Informations');
const QuestionAnswer = require('../database/QeustionAnswer');
const ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');
const stock = require('../config/stock');

/* admin 로그인, 로그아웃 */
router.get('/', async(req,res) => {
    if(req.session.is_admin_login){
        let users_info = await Informations.find();
        let q_a = await QuestionAnswer.find();
        console.log(q_a);
        return res.render('admin', {users_info : users_info, stock : stock, q_a : q_a});
    }else{
        return res.redirect('/admin_auth.html');
    }
});

router.post('/', (req, res) => {
    if(req.body.id === ADMIN_ACCOUNT.username && req.body.pw === ADMIN_ACCOUNT.password){
        req.session.is_admin_login = true;
        return res.redirect('/admin'); 
    }else{
        return res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send(`<script>alert('##로그아웃##');location.href='/';</script>`);
});

/* 제고 수량 */
router.post('/stock', (req, res) => {
    
});

/* Q&A 답변 */
router.post('/answer', (req, res) => {
    
});

/* 고객(사용자)들에게 이메일 보내는 기능 */
router.post('/email', async(req, res) => {
    let users_info = await Informations.find();
    let users_email_address='';

    for(i in users_info){ users_email_address += users_info[i].email + ', '; }
    
    let transporter = nodemailer.createTransport({
        service : 'naver',
        auth : {
            user : `${ADMIN_ACCOUNT.email_address}`,
            pass : `${ADMIN_ACCOUNT.email_password}`
        }
    });

    let mailOption = {
        from : `stylish 관리자 <${ADMIN_ACCOUNT.email_address}>`,
        to : `${users_email_address.substring(0, users_email_address.length-2)}`,
        subject : `${req.body.eventSubject}`,
        text : `${req.body.eventMessage}`
    }
    
    transporter.sendMail(mailOption, function(err, info){
        if(err){ 
            console.log(err);
            return res.send(`<script>alert('error');location.href='/admin';</script>`);
        }else{ 
            console.log('Message sent : ', info);
            return res.send(`<script>alert('success');location.href='/admin';</script>`);
        }
    });
});

/* 사용자 계정 삭제 */
router.post('/user/delete', async(req, res) => {
    await Informations.deleteOne({id : req.body.delete});
    return res.send(`<script>alert('삭제되었습니다.');location.href='/admin';</script>`);
});

/* 서버 점검 */
router.post('/server/check', (req, res) => {
    let status = require('../config/status');
    status.isBlocked = !status.isBlocked;
    
    jsonfile.writeFile(__dirname + '/../config/status.json', status, {spaces : 2}, err => {
        if(err){
            return res.send("<script>alert('알 수 없는 에러 발생');location.href='/admin'</script>");
        }else{
            if (status.isBlocked) { return res.send("<script>alert('서버점검');location.href='/admin'</script>");} 
            else { return res.send("<script>alert('서비스 정상 진행');location.href='/admin'</script>"); }    
        }
    }); 
}); 

module.exports = router;