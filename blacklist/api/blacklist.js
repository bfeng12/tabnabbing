const fs = require('fs');

/**
 * BLACKLIST
 * Adds url to blacklist
 */
module.exports = async function(req, res) {
    try {
        const content = await fs.readFileSync('blacklist.txt', "utf8");
        const websites = content.split('\n');
        websites.shift();

        if (!websites.includes(req.body.url)) await fs.appendFileSync('blacklist.txt', `\n${req.body.url}`);
        
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};