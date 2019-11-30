const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.route('/blacklist').post(require('./api/blacklist'));
app.route('/check').post(require('./api/check'));
app.route('/reset').post(require('./api/reset'));

const fs = require('fs');
try {
    fs.writeFileSync('blacklist.txt', '[Tabnabbing Blocklist]');
} catch (err) {
    console.log(err);
    process.exit(1);  
}

const port = 3000;
app.listen(port);
console.log(`app running on port ${port}`);