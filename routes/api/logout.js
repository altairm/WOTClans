/**
 * Created by mtm on 7/31/14.
 */
var
    express = require('express')
    , router = express.Router();

// Remove session data
router.get('/', function (req, res) {
    req.session.user = {
        authorized: false
    };

    res.redirect('/');
});

module.exports = router;
