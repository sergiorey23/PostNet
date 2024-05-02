const initOptions = {
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};

const pgp = require('pg-promise')(initOptions);

// using an invalid connection string:
// // CONSTRAINT prikey PRIMARY KEY(nickname)

const db = pgp('postgresql://jordi:@localhost:5432/postnet');

db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;
        console.log("Conexión establecida con éxito!");
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });
