const fs = require('fs');

/**
 * CHECK
 * Checks if URL is in blacklist
 */
module.exports = async function(req, res) {
    try {
        const content = await fs.readFileSync('blacklist.txt', "utf8");
        const websites = content.split('\n');
        websites.shift();

        console.log(websites);

        if (websites.includes(req.body.url)) {
            res.status(200).json({blacklisted: true});
        } else {
            res.status(200).json({blacklisted: false});
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};