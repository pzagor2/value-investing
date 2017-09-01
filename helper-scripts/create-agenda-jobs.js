'use strict';
const Agenda = require('agenda');
const config = require('../config/config');



const agenda = new Agenda({db: {address: config.mongoDBPath}});
agenda.on('ready', () => {
    agenda.cancel({}, (err, numRemoved) => {
        if (err) {
            console.log(err);
            return;
        }

        let promisees = config.agendaJobNames.map(job => {
            const promise = new Promise((resolve, reject) => {
                agenda.every(job, job, {}, null, (e, j) => {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(j);
                    }
                });
            });

            return promise;
        });

        Promise.all(promisees).then(jobs => {
            console.log(jobs);
            process.exit()
        });
    });
});