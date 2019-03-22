const redis = require('redis');
const client = redis.createClient();

module.exports = function() {
    client.on('connect', function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Redis client connected');
    });
};