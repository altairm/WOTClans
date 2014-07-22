var express = require('express');
var router = express.Router();

var wotapi = require('wot-api');

router.param('clan_id', function(req, res, next, id){
    req.clan_id = id;
    next();
});

/* GET clan listing. */
router.get('/:clan_id', function(req, res) {
    wotapi.clan(reqid, function(response){
        res.json(response);
    });
});

module.exports = router;
