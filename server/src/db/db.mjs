import sqlite3 from "sqlite3";

let env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development";

// The database file path is determined based on the environment variable.
const dbFilePath = env === "test" ? "./src/db/testdb.db" : "./src/db/db.db";

// The database is created and the foreign keys are enabled.
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) throw err;
    db.run("PRAGMA foreign_keys = ON");
});

/**
 * Inserts a new document in `documents`.
 * @param {string} id - document id
 * @param {string} title - document title
 * @param {string} stakeholders - document stakeholders
 * @param {string} scale - document scale
 * @param {string} issuanceDate - document issuanceDate
 * @param {string} type - document type
 * @param {string} language - document language
 * @param {string} coordinates - document coordinates
 * @param {number} connections - document connections
 * @returns {Promise} -
 */

function addDocument(
    id,
    title,
    stakeholders,
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connections
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO Document (id, title, stakeholders, scale, issuanceDate, type, language, coordinates, connections) VALUES (?,?,?,?,?,?,?,?,?)";
        db.run(
            query,
            [
                id,
                title,
                stakeholders,
                scale,
                issuanceDate,
                type,
                language,
                JSON.stringify(coordinates),
                connections,
            ],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function addDocumentConnection(
    id,
    documentId,
    connectionId
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO DocumentConnection (id, documentId, connectionId) VALUES (?,?,?)";
        db.run(
            query,
            [
                id,
                documentId,
                connectionId
            ],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function editDocument( 
    id,
    title,
    stakeholders,
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connections
) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE Document
            SET
                title = COALESCE(?, title),
                stakeholders = COALESCE(?, stakeholders),
                scale = COALESCE(?, scale),
                issuanceDate = COALESCE(?, issuanceDate),
                type = COALESCE(?, type),
                language = COALESCE(?, language),
                coordinates = COALESCE(?, coordinates),
                connections = COALESCE(?, connections)
            WHERE
                id = ?
        `;

        db.run(
            query,
            [
                title,
                stakeholders,
                scale,
                issuanceDate,
                type,
                language,
                coordinates,
                connections,
                id  
            ],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function editDocumentConnection(id, documentId, connectionId) {
    return new Promise((resolve, reject) => {
        const checkQuery = `
            SELECT 1 FROM DocumentConnection
            WHERE (documentId = ? AND connectionId = ?)
               OR (documentId = ? AND connectionId = ?)
        `;

        db.get(checkQuery, [documentId, connectionId, connectionId, documentId], (err, row) => {
            if (err) {
                return reject(err);
            }

            if (row) {
                
                return resolve();
            } else {
               
                const insertQuery = `
                    INSERT INTO DocumentConnection (id, documentId, connectionId)
                    VALUES (?, ?, ?)
                `;

                db.run(insertQuery, [id, documentId, connectionId], (err) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });
            }
        });
    });
}



export {
    addDocument,
    addDocumentConnection, 
    editDocument, 
    editDocumentConnection
};

