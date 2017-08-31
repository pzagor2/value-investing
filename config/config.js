



function getENVArrayValue(val) {
    if (val) {
        return val.split(' ');
    }
}
const Config = {
    port: process.env.PORT || 3000,
    tradingPairs: getENVArrayValue(process.env.TRAIDING_PAIRS) || ['BTC-USD', 'ETH-EUR', 'BTC-EUR'],
    agendaJobName: getENVArrayValue(process.env.JOB_NAMES) || ['trigger buy 5 min'],
    mongoDBPath: process.env.DB || 'mongodb://localhost/value-investing',
    gdax: {
        URI: 'https://api.gdax.com',
    }
};



module.exports = Config;