var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('/my_pages');
});

module.exports = router;