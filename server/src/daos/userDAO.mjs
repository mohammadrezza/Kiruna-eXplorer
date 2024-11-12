import db from '../db/db.mjs';

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM User WHERE username = ?`, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

export {
    getUserByUsername
}