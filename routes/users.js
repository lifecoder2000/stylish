const express = require('express');
const router = express.Router();
const Informations = require('../database/Informations');
const ShoppingBasket = require('../database/ShoppingBasket');
const PaymentBasket = require('../database/PaymentBasket');

/* 마이페이지 */
router.get('/mypage', async(req, res) => {
    if(req.session.is_user_login){ 
        let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
        let totalPrice = 0;
        for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].products.productCount); }
        let userInformations = await Informations.findOne({id : req.session.user_id});
        let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
        return res.render('mypage', {userName : userInformations.name, user_id:req.session.user_id, userPw : userInformations.pw, userPhoneNumber : userInformations.phone_number, userEmail : userInformations.email, userAddress : userInformations.address, basketCount : basketCount, userBasket : findUserBasket, totalPrice : totalPrice}); 
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
router.get('/mypage/basket',(req, res) => { return res.redirect('/cart'); });

/* 주문내역(주문내역(주문하기, 주문취소), 배송 조회,  교환&반품 신청) */
router.get('/mypage/Ordered', async(req, res) => {
    let findPaymentBasket = await PaymentBasket.find({userId : req.session.user_id});
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    if(findPaymentBasket){ 
        res.render('ordered', { PaymentBasket : findPaymentBasket, userId : req.session.user_id, basketCount : basketCount});
     }
});

router.post('/mypage/Ordered/cancelOrder',async(req,res) => {
    let findPaymentBasket = await PaymentBasket.findOne({_id : req.body._id});
    if(findPaymentBasket){
        await PaymentBasket.updateOne({_id : req.body._id},{status : "주문취소"});
        return res.send(`<script>alert('주문 취소가 되었습니다 :)');location.href='/user/mypage/Ordered';</script>`);
    }
});

router.get('/mypage/Ordered/takeBack', async(req,res) => {
    let findPaymentBasket = await PaymentBasket.findOne({_id : req.param('_id')});
    if(findPaymentBasket){
        if(req.param('choice') == "return"){
            await PaymentBasket.updateOne({_id : req.param('_id')},{status : "환불"});
            return res.send(`<script>alert('환불되었습니다 :)');location.href='/user/mypage/Ordered';</script>`);
        }
        if(req.param('choice') == "change"){
            await PaymentBasket.updateOne({_id : req.param('_id')},{status : "교환신청"});
            return res.send(`<script>alert('교환 신청되었습니다 :)');location.href='/user/mypage/Ordered';</script>`);
        }
    }
});

router.post('/mypage/Ordered/takeBack', async(req,res) => {
    let findPaymentBasket = await PaymentBasket.findOne({_id : req.body._id});
    if(findPaymentBasket){
        if(req.body.takeBack == "반품신청(환불)"){
            await PaymentBasket.updateOne({_id : req.param('_id')},{status : "환불"});
            return res.send(`<script>alert('환불되었습니다 :)');location.href='/user/mypage/Ordered';</script>`);
        }else{
            res.send(`<script>let choice = prompt('환불 하시겠습니까? 교환하시겠습니까? (환불 | 교환 입력)');
                if(choice === "환불"){ location.href='/user/mypage/Ordered/takeBack?choice=return&_id=${req.body._id}'; } 
                else if(choice === "교환"){ location.href='/user/mypage/Ordered/takeBack?choice=change&_id=${req.body._id}'; }
                else{ alert("제대로 입력해주세요");location.href='/user/mypage/Ordered'; };</script>`);
        }
    }
});

module.exports = router;