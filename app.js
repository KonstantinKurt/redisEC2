require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');

const redisConnection = require('./connections/redisConnection.js')
const dataRouter = require('./routes/dataRouter.js');
const transferData = require('./libs/transferRedisData.js');

const options = {
    key: fs.readFileSync('/home/ubuntu/privkey.pem'),
    cert: fs.readFileSync('/home/ubuntu/fullchain.pem'),
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', dataRouter);
transferData();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
httpServer.listen(process.env.HTTP_PORT);
httpsServer.listen(process.env.HTTPS_PORT);