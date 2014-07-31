/**
 * Created by mtm on 7/31/14.
 */
var
    express = require('express')
    , path = require('path')
    , querystring = require('querystring')
    , router = express.Router();

var config = require(path.join(__dirname, '../../config.js'));

router.get('/test', function (req, res) {
    req.session.user = {
        authorized:   true,
        access_token: "asdasdasd",
        expires_at:   "12323453647",
        account_id:   "35467",
        nickname:     "asd"
    };

    res.redirect('/');
});

// Process OpenID login result
router.get('/result', function (req, res) {
    if (req.params.status == "ok") {
        // Login successful, set user session
        req.session.user = {
            authorized:   true,
            access_token: req.params.access_token,
            expires_at:   req.params.expires_at,
            account_id:   req.params.account_id,
            nickname:     req.params.nickname
        };

        res.redirect('/');
    } else {
        // TODO: process login error
    }
});

// Start OpenID login
router.get('/', function (req, res) {
    var params = querystring.stringify({
        application_id: config.wot.api.application_id,
        redirect_uri:   config.api.login_result,
        nofollow:       1
    });

    req.wotapi.login(params, function (result) {
        if (result.status == "ok" && result.data.location) {
            res.redirect(result.data.location);
        } else {
            // TODO: process login error
        }
    });
});

module.exports = router;
