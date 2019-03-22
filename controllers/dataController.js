const redis = require('redis');
const client = redis.createClient();



module.exports = {
    addData: function(req, res) {
        client.hmset(req.body.key, 'name', req.body.name, 'age', req.body.age, function(err, reply) {
            if (err) {
                return res.status(500).json({ message: `There was a problem with saving object to redis`, data: { ...err.errors } });
            }
            console.log(reply);
            res.status(200).json({ message: "data stored succesfully" });
        });
    },
    getAllData: function(req, res) {
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
                .then(arr => res.json({ data: arr }))
                .catch(err => console.log(err))
        });
    },
    
    deleteAllData: function(req, res) {
        client.flushdb(function(err, succeeded) {
            if (err) {
                return res.status(500).json({ message: `There was a problem with clearing redis`, data: { ...err.errors } });
            }
            console.log(succeeded);
            res.json({ message: `all data cleared`, data: null })
        });
    },




};