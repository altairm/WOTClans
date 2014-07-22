var express = require('express');
var router = express.Router();

var wotapi = require('wot-api');

/* GET users listing. */
router.get('/', function(req, res) {
	wotapi.log();
  res.send('respond with a resource');
});

module.exports = router;
