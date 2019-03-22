const redis = require('redis');
const client = redis.createClient();



module.exports = {
    addData: async function(req, res) {
        client.hmset(req.body.key, 'name', req.body.name, 'age', req.body.age, function(err, reply) {
            if (err) {
                return res.status(500).json({ message: `There was a problem with saving object to redis`, data: { ...err.errors } });
            }
            console.log(reply);
            res.status(200).json({ message: "data stored succesfully" });
        });
    },
    getData: async function(req, res) {
        client.exists(req.body.key, function(err, reply) {
            if (reply === 1) {
                client.hgetall(req.body.key, function(err, result) {
                    if (err) {
                        return res.status(500).json({ message: "There was a problem with getting data from redis", data: { ...err.errors } });
                    }
                    console.log(result);
                    console.log(typeof(result));
                    res.status(200).json({ message: `data by key: ${req.body.key}`, data: JSON.stringify(result) })
                });
            } else {
                res.status(404).json({ message: `key: ${req.body.key} doesn't exists`, data: null })
            }
        });
    },
    getAllData: async function(req, res) {
        client.keys('*', function(err, keys) {
            if (err) {
                return res.status(500).json({ message: "There was a problem with getting keys from redis", data: { ...err.errors } });
            }
            let values = [];
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
                console.log(values);
                res.json({ data: values })
            })
        });
    },
    deleteAllData: async function(req, res) {
        client.flushdb(function(err, succeeded) {
            if (err) {
                return res.status(500).json({ message: `There was a problem with clearing redis`, data: { ...err.errors } });
            }
            console.log(succeeded); 
            res.json({ message: `all data cleared`, data: null })
        });
    },
    



};