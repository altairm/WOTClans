var express = require('express');
var router = express.Router();

router.get('/:account_id', function(req, res) {
    req.wotapi.account(req.params.account_id, function(account){
        if (account.status == "ok" && account.data) {
            // Store account data in DB
            for (var id in account.data) {
                if (account.data.hasOwnProperty(id)) {
                    req.db.collection(req.config.db.tables.accounts).update(
                        { account_id: id }, // what to update
                        account.data[id], // New data
                        { upsert: true, w: 0 } // Upsert without writeConcern (write confirmation)
                    );
                }
            }
            // Output
            res.json(account);
        } else {
            // TODO: do something when API response and/or data is unavailable
        }
    });
});

module.exports = router;