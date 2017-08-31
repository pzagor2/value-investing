'use strict';
const express = require('express');
const Agenda = require('agenda');
const Agendash = require('agendash');
const app = express();
const config = require('./config/config');
const price = require('./src/price');
const buyUtils = require('./src/buy-utils');
const gdaxBuy = require('./src/gdax-buy');
const Mongoose = require('mongoose');
//Models
const Job = require('./src/models/job');

//Mongoose connection
var mongoose = Mongoose.connect(config.mongoDBPath, { useMongoClient: true })
.then(() => {
    console.log('Connected to MongoDB at ', config.mongoDBPath);
    return Mongoose.connection;
})
.catch(err => console.log(`Database connection error: ${err.message}`));
mongoose.Promise = global.Promise;




const agenda = new Agenda({db: {address: config.mongoDBPath}});
agenda.on('ready', () => {
    agenda.start();
    console.log('Agenda started !!!');
});


config.agendaJobName.map(jobName => {
    agenda.define(jobName, (job, done) => {
        // console.log(job);
        Job.find({ name: job.attrs.name }).exec().then(data => {
            console.log(`New job process ${JSON.stringify(data)}`);
            let promisees = [];
            data.map(modelItem => {
                const item = modelItem._doc;
                // console.log(`Last price set to ${lastPrice}`);
                // console.log(`trigger buy`);
                const lastPrice = price.getPrice(item.pair);
                let promise;
        
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
        
                    if (item.gdax) {
                        promise =  gdaxBuy.buy(item.gdax, buyParams);
                    } else {
                        promise = Promise.reject('No GDAX object present in user object');
                    }

                    promisees.push(promise);
        
                    promise.then((success) => {
                        console.log(`Buy Success ${JSON.stringify(success)}`);
                    }).catch(error => {
                        console.log(`Buy Error ${JSON.stringify(error)}`);
                    });
                }
            });

            Promise.all(promisees).then(values => {
                // console.log(values);
                console.log('We are done calling done()');
                done();
            });
        });

        
    });
});



app.use('/', Agendash(agenda));
app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});