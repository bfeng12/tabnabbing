const fs = require('fs');

/**
 * RESET
 * Resets blacklist
 */
module.exports = async function(req, res) {
    try {
        await fs.writeFileSync('blacklist.txt', '[Tabnabbing Blocklist]');
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};