var express = require('express');
var router = express.Router();
var Informations = require('../database/Informations');

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/success', (req, res) => {
    res.send('hello ')
});

router.post('/', async(req, res) => {
    let compare = await Informations.findOne({id:req.body.id, pw:req.body.pw});    
    if(compare) { return res.send(`<script>location.href='/login/success';</script>`); }
});

module.exports = router;