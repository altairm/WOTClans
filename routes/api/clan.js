var express = require('express');
var router = express.Router();

/* GET clan listing. */
router.get('/:clan_id/extended', function (req, res) {
    req.wotapi.clan(req.params.clan_id, function (clan) {
        if (clan.status == "ok") {
            var members = clan.data[req.params.clan_id].members || {};
            var ids = [];
            for (member_id in members) {
                if (members.hasOwnProperty(member_id)) {
                    ids.push(member_id);
                }
            }
            req.wotapi.account(ids.join(","), function (clan_members) {
                if (clan_members.status == "ok") {
                    var accounts = clan_members.data || {};
                    for (var account_id in accounts) {
                        if (accounts.hasOwnProperty(account_id)) {
                            // Update DB

                            if (members.hasOwnProperty(account_id)) {
                                for (var property in accounts[account_id]) {
                                    if (accounts[account_id].hasOwnProperty(property)) {
                                        members[account_id][property] = accounts[account_id][property];
                                    }
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

router.get('/:clan_id', function (req, res) {
    req.wotapi.clan(req.params.clan_id, function (clan) {
        if (clan.status == "ok" && clan.data) {
            // Store clan data in DB
            for (var clanID in clan.data) {
                if (clan.data.hasOwnProperty(clanID)) {
                    req.db.collection(req.config.db.tables.clans).update(
                        { clan_id: clanID }, // what to update
                        clan.data[clanID], // New data
                        { upsert: true, w: 0 } // Upsert without writeConcern (write confirmation)
                    );
                }
            }
            // Output
            res.json(clan);
        } else {
            // TODO: do something when API response and/or data is unavailable
        }
    });
});


module.exports = router;
