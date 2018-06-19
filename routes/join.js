var express = require('express');
var router = express.Router();
var Informations = require('../database/Informations');

router.get('/', function(req, res, next) {
    res.send('/join router');
});

router.post('/', (req, res) => {
    Informations.create({id:req.body.id, pw:req.body.pw});
})

module.exports = router;