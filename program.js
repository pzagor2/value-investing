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
const mongo_express = require('mongo-express/lib/middleware');
const mongo_express_config = require('./config/mongo_express_config.js');
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



function handleJob(modelItem) {
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

        promise.then((success) => {
            console.log(`Buy Success ${JSON.stringify(success)}`);
        }).catch(error => {
            console.log(`Buy Error ${JSON.stringify(error)}`);
        });
    }

    return promise;
}
function handleAgendaJob(job, done) {
    Job.find({ name: job.attrs.name }).exec().then(data => {
        console.log(`New job process ${JSON.stringify(data)}`);
        let promisees = [];

        data.map(modelItem => {
            promisees.push(handleJob(modelItem));
        });

        Promise.all(promisees).then(values => {
            console.log('We are done calling done()');
            done();
        });
    }); 
}

var listenToAgendaJobs = function(jobName) {
    agenda.define(handleAgendaJob);
}

config.agendaJobName.map(listenToAgendaJobs);


app.use('/admin', mongo_express(mongo_express_config));
app.use('/agenda', Agendash(agenda));
app.get('/',(req, res) => {
    res.send('OK');
});
app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});