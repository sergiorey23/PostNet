const initOptions = {
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.error('CN:', e.cn);
            console.error('EVENT:', error.message || error);
        }
    }
};

const pgp = require('pg-promise')(initOptions);
// Preparing the connection details:
//IP maquina virtual de Sergio: 192.168.1.90
const cn = 'postgres://sergio:postnet1234@192.168.1.100:5432/postnet';

// Creating a new database instance from the connection details:
const db = pgp(cn);

db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;
        console.log("Connection succesful");
    })
    .catch(error => {
        console.error('ERROR:', error.message || error);
    });

// Exporting the database object for shared use:
module.exports = db;
