const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jsonfile = require('jsonfile');
const ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');
const Informations = require('../database/Informations');
const QuestionAnswer = require('../database/QuestionAnswer');
const Products = require('../database/Products');
const PaymentBasket = require('../database/PaymentBasket');

/* admin 로그인, 로그아웃 */
router.get('/', async(req,res) => {
    if(req.session.is_admin_login){
        let usersInfo = await Informations.find();
        let q_a = await QuestionAnswer.find();
        let products = await Products.find();
        let payment = await PaymentBasket.find();
        return res.render('admin', {users_info : usersInfo,  q_a : q_a, products : products, PaymentBasket : payment});
    }
    else{ return res.redirect('/admin_auth.html'); }
});

router.post('/', (req, res) => {
    if(req.body.id === ADMIN_ACCOUNT.username && req.body.pw === ADMIN_ACCOUNT.password){
        req.session.is_admin_login = true;
        return res.redirect('/admin'); 
    }
    else{ return res.redirect('/'); }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send(`<script>alert('##로그아웃##');location.href='/';</script>`);
});

/* Q&A 답변 */
router.post('/answer', async(req, res) => {
    let findQuestion = await QuestionAnswer.findOne({writer : req.body.writer, title : req.body.title, text : req.body.text});
    if(findQuestion){
        await QuestionAnswer.updateOne({_id : findQuestion._id}, {answer : req.body.answer, status : true});
        return res.send(`<script>alert('답변 완료하였습니다.');location.href='/admin';</script>`);
    }
    else{ return res.send(`<script>alert('오류가 발생했습니다.');location.href='/';</script>`); }
});

/* 상품 추가, 상품 삭제, 상품 재고 및 가격 수정   */
router.post('/product/add', async(req, res) => {
    if(req.body.low == "T-shirt"){ productCreate(req, 'T-shirt for everyone, you will too.'); }
    else if(req.body.low == "Y_shirt"){ productCreate(req, 'y-shirt, the moment you wear this shirt, you will shine.'); }
    else if(req.body.low == "denim_shirt"){ productCreate(req, 'Wearing in hot weather, you can be the main character, Denim-shirt, as cool as the waves on the sea.'); }
    else if(req.body.low == "slacks"){ productCreate(req, `Slacks catches everyone's eyes.`); }
    else if(req.body.low == "blue_jeans"){ productCreate(req, 'You can be Poseidon, too.'); }
    else if(req.body.low == "cotton_trousers"){ productCreate(req, 'Did you realize the aesthetic of sophistication?'); }
    else if(req.body.low == "echo"){ productCreate(req, `Echoback, it's a bag, but it's also a fashion.`); }
    else if(req.body.low == "school"){ productCreate(req, 'This bag is a reliable friend who will help you get to school.'); }
    else if(req.body.low == "cross"){ productCreate(req, `It's no use having a lot of content.`); }
    else if(req.body.low == "sneakers"){ productCreate(req, 'The sneakers are very nice.'); }
    else if(req.body.low == "sandals"){ productCreate(req, 'modern sandals that are effective for ventilation'); }
    else if(req.body.low == "canvas"){ productCreate(req, 'You can be as young as the students!'); }
    return res.send(`<script>alert('상품 생성 완료:)');location.href='/admin';</script>`);
});

router.post('/product/delete', async(req, res) => {
    await Products.deleteOne({_id : req.body._id});
    return res.send(`<script>alert('상품 삭제 완료:)');location.href='/admin';</script>`);
});

router.post('/product/amount/change', async(req, res) => {
    let findProducts = await Products.findOne({name : req.body.productName, purchaseAmount : req.body.productPurchaseAmout});
    if(findProducts){
        await Products.updateOne({_id : findProducts._id},{stock : req.body.productStock, price : req.body.productPrice});
        return res.send(`<script>alert('수량 및 가격 수정 완료:)');location.href='/admin';</script>`);
    }
});

router.post('/paymentStatusChange', async(req,res) => {
    let findPaymentBasket = await PaymentBasket.findOne({userId : req.body.userId, _id : req.body._id});
    if(findPaymentBasket){
        await PaymentBasket.updateOne({userId : req.body.userId, _id : req.body._id},{status : req.body.paymentStatus});
        return res.send(`<script>alert('배송 상태 업데이트 완료 :)');location.href='/admin';</script>`);
    }
});

/* 고객(사용자)들에게 이메일 보내는 기능 */
router.post('/email', async(req, res) => {
    let usersInfo = await Informations.find();
    let usersEmailAddress='';
    for(i in usersInfo){ usersEmailAddress += usersInfo[i].email + ', '; }
    let transporter = nodemailer.createTransport({
        service : 'naver',
        auth : {
            user : `${ADMIN_ACCOUNT.email_address}`,
            pass : `${ADMIN_ACCOUNT.email_password}`
        }
    });
    let mailOption = {
        from : `stylish 관리자 <${ADMIN_ACCOUNT.email_address}>`,
        to : `${users_email_address.substring(0, usersEmailAddress.length-2)}`,
        subject : `${req.body.eventSubject}`,
        text : `${req.body.eventMessage}`
    }
    transporter.sendMail(mailOption, function(err, info){
        if(err){ return res.send(`<script>alert('error');location.href='/admin';</script>`); }
        else{ return res.send(`<script>alert('success');location.href='/admin';</script>`); }
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
        if(err){ return res.send("<script>alert('알 수 없는 에러 발생');location.href='/admin'</script>"); }
        else{
            if (status.isBlocked) { return res.send("<script>alert('서버점검');location.href='/admin'</script>");} 
            else { return res.send("<script>alert('서비스 정상 진행');location.href='/admin'</script>"); }    
        }
    }); 
}); 

/* product create function */
async function productCreate(req, getDescription){
    await Products.create({
        name : req.body.productName,
        price : req.body.productPrice,
        highCategoryFilter : req.body.high,
        lowCategoryFilter : req.body.low,
        description : getDescription,
        category : {
            highCategory : req.body.high,
            lowCategory : req.body.low
        }
    });
}

module.exports = router;