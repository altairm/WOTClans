var express = require('express');
var router = express.Router();

router.param('clan_id', function(req, res, next, id){
    req.clan_id = id;
    next();
});

/* GET clan listing. */
router.get('/:clan_id', function(req, res) {
    req.wotapi.clan(req.clan_id, function(clan){
        if (clan.status == "ok") {
            var members = clan.data[req.clan_id].members || {};
            var ids = [];
            for (member_id in members) {
                if (members.hasOwnProperty(member_id)) {
                    ids.push(member_id);
                }
            }
            req.wotapi.account(ids.join(","), function(clan_members){
                if (clan_members.status == "ok") {
                    var accounts = clan_members.data || {};
                    for (account_id in accounts) {
                        if (accounts.hasOwnProperty(account_id) && members.hasOwnProperty(account_id)) {
                            Object.prototype.extend = function(obj) {
                                for(property in obj) {
                                    if (obj.hasOwnProperty(property)) {
                                        this[property] = obj[property];
                                    }
                                }
                            };
                            members[account_id].extend(accounts[account_id]);
                        }
                    }
                }
                res.json(clan);
            });
        } else {
            res.json(clan);
        }
    });
});

module.exports = router;
