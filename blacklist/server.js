const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
app.use(bodyParser.json());// support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

const url = require("url");
const db = require("./db.js")

/**
 * Add a URL to the MySQL db blacklist table.
 */
app.post('/blacklist', (req, res, next) => {
    let blacklistURL;
    try {
        blaclistURL = url.parse(req.body.url).hostname
    } catch (err) {
        return next(err)
    }

    let query = "INSERT INTO blacklist(url) VALUES(?)"
    db.query(query, blacklistURL, (error, results) => {
        if (err) {
            console.log("error: ", error);
            next(error)
        } else {
            res.send("Successfully Inserted.")
        }
    })
})

/**
 * Retrieve current blacklist.
 */
app.get('/blacklist', (req, res) => {
    db.query("SELECT url FROM blacklist", (error, results) => {
        if(err) {
            console.log("error: ", error);
            next(error)
        }
        else {
            res.send(results)
        }
    })
})

/**
 * See if url is in blacklist. Returns results from running query.
 */
app.get('/blacklist/:url', (req, res) => {
    let blacklistURL = req.params.url
    db.query("SELECT url FROM blacklist WHERE url = ?", blacklistURL, (error, results) => {
        if(err) {
            console.log("error: ", error);
            next(error)
        } else {
            res.send(results)
        }
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))