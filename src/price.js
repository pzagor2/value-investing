'use strict';
const config = require('../config/config');
const Gdax = require('gdax');

const websocket = new Gdax.WebsocketClient(config.tradingPairs);

let publicClients = {};
let lastPrice = {};



websocket.on('message', data => {
    if (data.type === 'match') {
        lastPrice[data.product_id] = data.price;
        console.log(`Last price for ${data.product_id} set to ${data.price}`);
    }
});
websocket.on('error', err => { /* handle error */ });
websocket.on('close', () => {
    console.log('Websocket closed');
    webSocketStateChange();
});

function webSocketStateChange() {
    setTimeout(() => websocket.connect(), 5000);
}

config.tradingPairs.map(pair => {
    const client = new Gdax.PublicClient(pair, config.gdax.URI);
    publicClients[pair] = client;

    client.getProductTicker((error, response, data) => {
        lastPrice[pair] = data.price;
        console.log(`Last price for ${pair} set to ${data.price}`);
    });
});


const Price = {
    getPrice: function(tradingPair) {
        return lastPrice[tradingPair];
    }
};

module.exports = Price;