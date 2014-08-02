var fs = require('fs');

var config = {
    app: {
        port: 3000,
        port_ssl: 3001,
        ssl : {
            key: fs.readFileSync('./ssl/wot.mtm.mx.key'),
            cert: fs.readFileSync('./ssl/wot.mtm.mx.crt'),
            passphrase: "EPBvHYNHCVV5QtcaYTP92I0JTYDEjISL"
        }
    },
    wot: {
        api: {
            host: "https://api.worldoftanks.ru/wot",
            application_id: "806c213f43a41761f2d80c8e65f5fa61"
        },

        login: {
            resultUrl: "http://wot.mtm.mx/login/result"
        }
    },
    db: {
        host: "127.0.0.1",
        port: 27017,
        database: "wotclans",
        tables: {
            accounts: "accounts",
            clans: "clans"
        }
    }
};
module.exports = config;