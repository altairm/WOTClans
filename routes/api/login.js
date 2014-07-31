/**
 * Created by mtm on 7/31/14.
 */
var
    express = require('express')
    , router = express.Router();


router.get('/test', function (req, res) {
    req.session.user = {
        authorized: true,
        access_token: "9bf411b617b9c3d66110936989c9ea5a",
        expires_at: "2506848250",
        account_id: "99999999",
        nickname: "Demo user"
    };

    res.redirect('/');
});

// Process OpenID login result
router.get('/result', function (req, res) {
    if (req.query.status && req.query.status == "ok") {
        // Login successful, set user session
        req.session.user = {
            authorized: true,
            access_token: req.query.access_token,
            expires_at: req.query.expires_at,
            account_id: req.query.account_id,
            nickname: req.query.nickname
        };

        res.redirect('/');
    } else {
        // TODO: process login error
    }
});

// Prolong the access token duration
router.get('/extend', function (req, res) {
    if (req.session.user && req.session.user.access_token) {
        req.wotapi.login_extend(req.session.user.access_token, function (result) {
            req.session.user.expires_at = result.expires_at || 0;
        });
    }
    res.redirect('/');
});

// Start OpenID login
router.get('/', function (req, res) {
    req.wotapi.login(function (result) {
        if (result.status == "ok" && result.data.location) {
            res.redirect(result.data.location);
        } else {
            // TODO: process login error
        }
    });
});

module.exports = router;
