var express = require('express');
var router = express.Router();

/* GET clan listing. */
router.get('/:clan_id', function(req, res) {
    req.wotapi.clan(req.params.clan_id, function(clan){
        if (clan.status == "ok") {
            var members = clan.data[req.params.clan_id].members || {};
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
                            for(property in accounts[account_id]) {
                                if (accounts[account_id].hasOwnProperty(property)) {
                                    members[account_id][property] = accounts[account_id][property];
                                }
                            }
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
