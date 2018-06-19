var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('/service_center router');
});

module.exports = router;