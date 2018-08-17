const express = require('express');
const router = express.Router();
const Informations = require('../database/Informations');
const ShoppingBasket = require('../database/ShoppingBasket');
const PaymentBasket = require('../database/PaymentBasket');

/* 마이페이지 */
router.get('/mypage', async(req, res) => {
    if(req.session.is_user_login){ 
        let userInformations = await Informations.findOne({id : req.session.user_id});
        return res.render('mypage', {userName : userInformations.name, userId:req.session.user_id, userPw : userInformations.pw, userPhoneNumber : userInformations.phone_number, userEmail : userInformations.email, userAddress : userInformations.address}); 
    }
    else{ return res.send(`<script>alert('로그인 하지 않았습니다.');location.href='/';</script>`); }
});

/* 개인정보 수정 */
router.post('/informations', async(req, res) => {
    if(req.body.submit === 'leave'){
        await Informations.deleteOne({id : req.body.userId});
        return res.send(`<script>alert('leave success');location.href='/';</script>`);
    }else{
        let findUserInformation = await Informations.findOne({id : req.session.user_id});
        if(findUserInformation){
            await Informations.updateOne({_id : findUserInformation._id}, {pw : req.body.userPw, phone_number : req.body.userPhoneNumber, email : req.body.userEmail, address : req.body.userAddress});
            return res.send(`<script>alert('update success');location.href='/user/mypage';</script>`);
        }
    }
});

/* 장바구니 및 물건추가*/
router.get('/mypage/basket', async(req, res) => {
    // 결제는 service.js : /payment에서 처리할예정
    return res.redirect('/cart');
});

/* 주문내역(주문내역(주문하기, 주문취소), 배송 조회,  교환&반품 신청) */
router.get('/mypage/Ordered', async(req, res) => {
    let findPaymentBasket = await PaymentBasket.find({userId : req.session.user_id});
    if(findPaymentBasket){ res.render('ordered', { PaymentBasket : findPaymentBasket, userId : req.session.user_id}); }
});

router.get('/check', (req, res) => {
    // 배송 조회
});

router.get('/application', (req, res) => {
    //교환&반품 신청
});

router.post('/appication', (req, res) => {
    //교환&반품 신청
});

module.exports = router;