const config = require('../config/config');
const Mongoose = require('mongoose');
const Job = require('../src/models/job');

//Mongoose connection
var mongoose = Mongoose.connect(config.mongoDBPath, { useMongoClient: true })
.then(() => {
    console.log('Connected to MongoDB at ', config.mongoDBPath);
    return Mongoose.connection;
})
.catch(err => console.log(`Database connection error: ${err.message}`));
mongoose.Promise = global.Promise;

var job = new Job({
    name: '5 minutes',
    pair: 'BTC-EUR', 
    amount: '1',
    gdax: {
        secret: ``,
        key: ``,
        passphrase: ``,
        URI: ``
    }
  });

job.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully!');
});