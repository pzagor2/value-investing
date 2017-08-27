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
{
"jobs":[
    {
        "pair":"BTC-EUR",
        "amount":"5",
        "user":"",
        "gdax":{
            "secret":"",
            "key":"",
            "passphrase":"",
            "URI":"https://api-public.sandbox.gdax.com"
        }
    }
]
}
```