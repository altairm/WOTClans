var express = require('express');
var router = express.Router();

router.param('clan_id', function(req, res, next, id){
    req.clan_id = id;
    next();
});

/* GET clan listing. */
router.get('/:clan_id', function(req, res) {
    req.wotapi.clan(req.clan_id, function(response){
        res.json(response);
    });
});

module.exports = router;
