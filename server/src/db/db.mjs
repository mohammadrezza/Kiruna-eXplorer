import sqlite3 from "sqlite3";
import Document from "../components/Document.mjs";

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
 * @param {string} description - document description
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
    description,
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
            "INSERT INTO Document (id, title, description, stakeholders, scale, issuanceDate, type, language, coordinates, connections) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.run(
            query,
            [
                id,
                title,
                description,
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
                JSON.stringify(coordinates),
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

        });
    }

function deleteAllConnections(id) {

    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM DocumentConnection
            WHERE documentId = ? OR connectionId = ?
        `;

        db.run(query, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


async function getDocumentWithConnections(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                d.id as doc_id,
                d.title as doc_title,
                d.description as doc_description,
                d.stakeholders as doc_stakeholders,
                d.scale as doc_scale,
                d.issuanceDate as doc_issuanceDate,
                d.type as doc_type,
                d.language as doc_language,
                d.coordinates as doc_coordinates,
                cd.id as conn_id,
                cd.title as conn_title,
                cd.stakeholders as conn_stakeholders,
                cd.scale as conn_scale,
                cd.issuanceDate as conn_issuanceDate,
                cd.type as conn_type,
                cd.language as conn_language,
                cd.coordinates as conn_coordinates
            FROM Document d
            LEFT JOIN DocumentConnection dc ON d.id = dc.documentId OR d.id = dc.connectionId
            LEFT JOIN Document cd ON 
                CASE 
                    WHEN dc.documentId = d.id THEN dc.connectionId = cd.id
                    WHEN dc.connectionId = d.id THEN dc.documentId = cd.id
                END
            WHERE d.id = ?`;

        db.all(query, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function getAllDocuments(documentId, title) {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                d.*,
                CASE 
                    WHEN ? IS NOT NULL AND EXISTS (
                        SELECT 1 FROM DocumentConnection dc 
                        WHERE (dc.documentId = d.id AND dc.connectionId = ?) 
                        OR (dc.connectionId = d.id AND dc.documentId = ?)
                    ) THEN 1
                    ELSE 0
                END as is_connected
            FROM Document d
            WHERE 1=1
        `;

        const params = [];

        // Add documentId parameter three times for the CASE statement
        if (documentId) {
            params.push(documentId, documentId, documentId);
            // Exclude the document with provided ID
            query += ` AND d.id != ?`;
            params.push(documentId);
        } else {
            params.push(null, null, null);
        }

        // Add title search condition if provided
        if (title) {
            query += ` AND d.title LIKE ?`;
            params.push(`%${title}%`);
        }

        query += ` ORDER BY d.created_at DESC`;

        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const documents = rows.map(row => {
                    const document = new Document();
                    document.createFromDatabaseRow(row);
                    return document;
                });
                resolve(documents);
            }
        });
    });
}

export {
    addDocument,
    addDocumentConnection,
    getAllDocuments,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections
};

