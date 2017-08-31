// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var jobSchema = new Schema({
    name: String,
    pair: String, 
    amount: String,
    gdax: {
        secret: String,
        key: String,
        passphrase: String,
        URI: String
    }
});


var Job = mongoose.model('Job', jobSchema);

module.exports = Job;