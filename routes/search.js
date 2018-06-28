var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('/search pages');
});

module.exports = router;