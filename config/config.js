

const Config = {
    port: process.env.PORT || 3000,
    tradingPairs: process.env.TRAIDING_PAIRS.split(' ') || ['BTC-USD', 'ETH-EUR', 'BTC-EUR'],
    agendaJobName: process.env.JOB_NAMES.split(' ') || ['trigger buy 5 min'],
    mongoDBPath: process.env.DB || 'mongodb://localhost/value-investing',
    gdax: {
        URI: 'https://api.gdax.com',
    }
};



module.exports = Config;