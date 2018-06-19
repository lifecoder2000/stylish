var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('/shopping_basket router');
});

module.exports = router;