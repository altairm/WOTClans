var express = require('express');
var router = express.Router();

router.param('account_id', function(req, res, next, id){
    req.account_id = id;
    next();
});

router.get('/:account_id', function(req, res) {
    req.wotapi.account(req.account_id, function(account){
        res.json(account);
    });
});

module.exports = router;