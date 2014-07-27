var express = require('express');
var router = express.Router();

router.get('/:account_id', function(req, res) {
    req.wotapi.account(req.params.account_id, function(account){
        res.json(account);
    });
});

module.exports = router;