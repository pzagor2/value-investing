#Config example for config.js
```
const Config = {
    port: 3000,
    tradingPairs: ['BTC-USD', 'ETH-EUR'],
    agendaJobName: 'trigger buy',
    mongoDBPath: 'mongodb://127.0.0.1/value-investing',
    gdax: {
        URI: 'https://api-public.sandbox.gdax.com',
    }
};
```
#Example Agenda job data:
```
var job = new Job({
    name: 'trigger buy 5 min',
    pair: 'BTC-EUR', 
    amount: '10',
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
```

#You can set these ENV variables
process.env.PORT
process.env.TRAIDING_PAIRS.split(' ')
process.env.JOB_NAMES.split(' ')
process.env.DB
