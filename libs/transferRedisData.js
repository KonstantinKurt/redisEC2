const dataController = require('../controllers/dataController.js');
const redis = require('redis');
const client = redis.createClient();
const fetch = require('node-fetch');
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

function sendRequest() {
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
            //process.stdout.write(d)
            console.log(d);
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
        if (err) {
            console.log(err);
        }
        let promises = [];
        for (let i = 0; i < keys.length; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    client.hgetall(keys[i], function(err, result) {
                        if (err) {
                            return console.log(err);
                        }
                        values.push(result);
                        resolve();
                    });
                })
            );

        }
        Promise.all(promises).then(() => {
            if (values.length != 0) {
                sendRequest();
            }
        })
    });
};






module.exports = function() {
    setInterval(transfer, 3000);
};