const Gdax = require('gdax');

const GdaxBuy = {
    buy: function({gdax, buyParams}) {
        const p = new Promise((resolve, reject) => {
            const authedClient = new Gdax.AuthenticatedClient(gdax.key, gdax.secret, gdax.passphrase, gdax.URI);
            
            authedClient.buy(buyParams, (error, response, data) => {
                if (error || response.statusCode != 200) {
                    reject({error, data});
                } else {
                    resolve(data);
                }
            });
        });
        return p;
    }
};



module.exports = GdaxBuy;