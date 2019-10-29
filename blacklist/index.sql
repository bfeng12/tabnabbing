/* Initiate blacklist server as MySQL server*/
CREATE DATABASE tabnabbing;
use tabnabbing;

CREATE TABLE blacklist (
    id INT NOT NULL AUTO_INCREMENT,
    url TEXT NOT NULL,
    PRIMARY KEY (id)
);

/* Example Queries to Run */
-- INSERT INTO blacklist(url) VALUES ("example123.com");
-- SELECT 1 FROM blacklist WHERE url = "example123.com";