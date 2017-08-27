const express = require('express');
const Agenda = require('agenda');
const Agendash = require('agendash');
const app = express();
// const Gdax = require('gdax');
// const argv = require('yargs').argv;
const config = require('./config/config');
const price = require('./src/price');
const buyUtils = require('./src/buy-utils');
const gdaxBuy = require('./src/gdax-buy');




const agenda = new Agenda({db: {address: config.mongoDBPath}});
agenda.on('ready', () => {
    agenda.start();
    console.log('Agenda started !!!');
});


agenda.define(config.agendaJobName, (job, done) => {
    console.log(`New job process ${JSON.stringify(job.attrs.data)}`);
    const data = job.attrs.data;

    data.jobs.map(item => {
        
        // console.log(`Last price set to ${lastPrice}`);
        // console.log(`trigger buy`);
        const lastPrice = price.getPrice(item.pair);

        if (lastPrice) {
            const finalPrice = buyUtils.getFinalPrice(lastPrice);
            const buyParams = {
                price: finalPrice,
                size: buyUtils.calculateSizeToBuy(finalPrice, item.amount),
                product_id: item.pair,
                type: 'limit',
                // post_only: true,
                cancel_after: 'hour'
            };

            let promise;

            if (item.gdax) {
                promise =  gdaxBuy.buy({
                    gdax: item.gdax,
                    buyParams: buyParams
                });
            } else {
                done();
            }

            promise.then((succes) => {
                console.log(`Buy Success ${JSON.stringify(succes)}`);
                done();
            }).catch(error => {
                console.log(`Buy Error ${JSON.stringify(error)}`);
            });
        }
    });
    
});


app.use('/dash', Agendash(agenda));
app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});