const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');


// let options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/node.qbex.io/fullchain.pem'),
//     cert: fs.readFileSync('./localhost.key'),
// };

let options = {
    key: fs.readFileSync('/home/ubuntu/privkey.pem'),
    cert: fs.readFileSync('/home/ubuntu/fullchain.pem'),
};


const redisConnection = require('./connections/redisConnection.js')
const dataRouter = require('./routes/dataRouter.js');
const transferData = require('./libs/transferRedisData.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', dataRouter);

transferData();

let server = https.createServer(options, app).listen(process.env.PORT, function(){
  redisConnection();
  console.log("Express server listening on port " + process.env.PORT);
});


app.get('/', (req, res) => {
    res.send('test');

});
// app.listen(process.env.PORT, () => {
//     redisConnection();
//     console.log(`Server runs on http://localhost:'  ${process.env.PORT}  '; Ctrl+C for exit `);
// });