var express = require('express');
var router = express.Router();

/* GET clan listing. */
router.get('/', function(req, res) {
    res.render('clan_personnel');
});

module.exports = router;
