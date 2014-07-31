var express = require('express');
var router = express.Router();

/* GET clan listing. */
router.get('/', function(req, res) {
    res.render('pages/clan/personnel', req.session);
});

module.exports = router;
