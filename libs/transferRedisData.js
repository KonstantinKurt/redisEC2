const dataController = require('../controllers/dataController.js');
const redis = require('redis');
const client = redis.createClient();
const http = require('http');
const https = require('https');

function clearRedis() {
    client.flushdb((err, succeeded) => {
        err ? console.log(err) : console.log(succeeded);
    });
};

function sendRequest(values) {
    const data = JSON.stringify(values);
    const options = {
        hostname: '0k5asdc3je.execute-api.eu-central-1.amazonaws.com',
        port: 443,
        path: '/dev/db',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    https
	    .request(options, (res) => {
	        console.log(`statusCode: ${res.statusCode}`)
	        res.on('data', d => {
	            process.stdout.write(d);
	            clearRedis();
	        })
	    })
	    .on('error', error => console.error(error))
	    .write(data)
	    
}


function transfer() {
    client.keys('*', function(err, keys) {
        err ? console.log(err) : null;

        const promises = keys.map(key => new Promise((resolve, reject) => {
            client.hgetall(key, (err, result) => {
                err ? reject(err) : null;
                resolve(result);
            });
        }));

        Promise
            .all(promises)
            .then(arr => arr.length ? sendRequest(arr) : null)
            .catch(err => console.log(err))
    });
};

module.exports = function() {
    setInterval(transfer, 3000);
};