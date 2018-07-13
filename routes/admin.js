var express = require('express');
var router = express.Router();
var ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');

/* admin 로그인, 로그아웃 */
router.get('/', (req,res) => {
    if(req.session.is_admin_login){
        return res.render('admin');
    }else{
        return res.redirect('/admin_auth.html');
    }
});

router.post('/', (req, res) => {
    if(req.body.id === ADMIN_ACCOUNT.username && req.body.pw === ADMIN_ACCOUNT.password){
        req.session.is_admin_login = true;
        return res.redirect('/admin'); 
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send(`<script>alert('##로그아웃##');location.href='/';</script>`);
});

/* 회원 관리, 물품 관리 등등.... */

module.exports = router;