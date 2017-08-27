

const Config = {
    port: 3000,
    tradingPairs: ['BTC-USD', 'ETH-EUR'],
    agendaJobName: 'trigger buy',
    mongoDBPath: 'mongodb://127.0.0.1/value-investing',
    gdax: {
        URI: 'https://api-public.sandbox.gdax.com',
    }
};



module.exports = Config;