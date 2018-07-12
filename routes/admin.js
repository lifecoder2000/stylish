var express = require('express');
var router = express.Router();
var ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');

router.get('/auth', function(req,res,next){
    res.redirect('/admin_auth.html');
});

router.get('/', function(req,res,next){
    if( req.session.is_admin_login){
        res.render('admin');
    }else{
        res.send('who are you?');
    }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});

router.post('/', function(req, res, next) {
        if(req.body.id === ADMIN_ACCOUNT.username && req.body.pw === ADMIN_ACCOUNT.password){
            req.session.is_admin_login = true;
            return res.redirect('/admin'); 
        }
});

module.exports = router;