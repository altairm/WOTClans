var express = require('express')
    , moment = require('moment');
var router = express.Router();

/* GET clan listing. */
router.get('/', function (req, res, next) {
    // Try to fetch account from DB
    try {

        if (req.session.user.authorized) {

            req.db.collection(req.config.db.tables.accounts).findOne({
                account_id: req.session.user.account_id
            }, function (err, account) {
                if (err) throw err;

                // Try to fetch clan data from DB
                if (account.clan_id) {
                    req.db.collection(req.config.db.tables.clans).findOne({
                        clan_id: account.clan_id
                    }, function (err, clan) {

                        if (err) throw err;

                        for (var member_id in clan.members) {
                            if (clan.members.hasOwnProperty(member_id)) {
                                clan.members[member_id].created_at = moment.unix(clan.members[member_id].created_at).format("DD.MM.YYYY");
                            }
                        }

                        res.render('pages/clan/personnel', {
                            session: req.session,
                            clan: clan
                        });
                    });
                }

            });
        } else {
            res.render('pages/empty', {
                session: req.session
            });
        }

    } catch (err) {
        next(err);
    }
});

module.exports = router;
