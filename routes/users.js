const express = require('express');
const router = express.Router();
const Informations = require('../database/Informations');

/* 마이페이지 */
router.get('/mypage', (req, res) => {
    if(req.session.is_user_login){
        // user informations like name, id, phone-number, etc...
        
    }
    else{ return res.send(`<script>alert('로그인 하지 않았습니다.');location.href='/';</script>`); }
});

/* 개인정보 수정 */
router.post('/informations', (req, res) => {
   // You must write to user informations update code 
});

/* 장바구니 */
router.get('/bascket', (req, res) => {
    // 결제는 service.js : /payment에서 처리할예정
});

/* 주문내역(주문내역(주문하기, 주문취소), 배송 조회,  교환&반품 신청) */
router.get('/order', (req, res) => {
    //주문내역, 주문하기, 주문취소
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