const dataController = require('../controllers/dataController.js');
const redis = require('redis');
const client = redis.createClient();
const http = require('http');
const https = require('https');
var querystring = require('querystring');
const request = require('request')

function clearRedis() {
    client.flushdb(function(err, succeeded) {
        if (err) {
            console.log(err);
        }
        console.log(succeeded);
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
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', (d) => {
            process.stdout.write(d)
            clearRedis();
        })
    })
    req.on('error', (error) => {
        console.error(error)
    })
    req.write(data)
    req.end()
}


function transfer() {
    let values = [];
    client.keys('*', function(err, keys) {
        err ? console.log(err) : null;     
		let promises = keys.map(key => new Promise((resolve, reject) => {
            client.hgetall(keys[i], (err, result) => {
                err ? reject(err) : null;                                 
                resolve(result);
            });
        }));

        // for (let i = 0; i < keys.length; i++) {
        //     promises.push(
        //         new Promise((resolve, reject) => {
        //             client.hgetall(keys[i], function(err, result) {
        //                 if (err) {
        //                     return console.log(err);
        //                 }
        //                 values.push(result);
        //                 resolve();
        //             });
        //         })
        //     );

        // }

        Promise
	        .all(promises)
	        .then((arr) => sendRequest(arr))
	        .catch(err=>console.log(err))
    });
};






module.exports = function() {
    setInterval(transfer, 3000);
};