import db from "../db/db.mjs";
import Document from "../components/document.mjs";

/**
 * Inserts a new document in `documents`.
 * @param {string} id - document id
 * @param {string} title - document title
 * @param {string} description - document description
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
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connections
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO Document (id, title, description, scale, issuance_date, type, language, coordinates, connections) VALUES (?,?,?,?,?,?,?,?,?)";
        db.run(
            query,
            [
                id,
                title,
                description,
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

function addDocumentStakeholder(
    id,
    documentId,
    stakeholder
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO DocumentStakeholder (id, document_id, stakeholder) VALUES (?,?,?)";
        db.run(
            query,
            [
                id,
                documentId,
                stakeholder
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
    connectionId,
    type
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO DocumentConnection (id, documentId, connectionId, type) VALUES (?,?,?,?)";
        db.run(
            query,
            [
                id,
                documentId,
                connectionId,
                type
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

async function getDocumentStakeholders(documentId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM DocumentStakeholder
            WHERE document_id = ?
            ORDER BY created_at ASC`;

        db.all(query, [documentId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


function editDocument(
    id,
    title,
    description,
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
                description = COALESCE(?, description),
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
                description,
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

function deleteAllStakeholders(documentId) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM DocumentStakeholder
            WHERE document_id = ?
        `;

        db.run(query, [documentId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function editDocumentConnection(id, documentId, connectionId, type) {

    return new Promise((resolve, reject) => {

        const insertQuery = `
                    INSERT INTO DocumentConnection (id, documentId, connectionId, type)
                    VALUES (?, ?, ?, ?)
                `;

        db.run(insertQuery, [id, documentId, connectionId, type], (err) => {
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

        db.run(query, [id, id], (err) => {
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
                d.scale as doc_scale,
                d.issuanceDate as doc_issuanceDate,
                d.type as doc_type,
                d.language as doc_language,
                d.coordinates as doc_coordinates,
                cd.id as conn_id,
                cd.title as conn_title,
                cd.scale as conn_scale,
                cd.issuanceDate as conn_issuanceDate,
                cd.type as conn_type,
                cd.language as conn_language,
                cd.coordinates as conn_coordinates,
                dc.type as conn_type
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

        if (documentId) {
            params.push(documentId, documentId, documentId);
            query += ` AND d.id != ?`;
            params.push(documentId);
        } else {
            params.push(null, null, null);
        }

        if (title) {
            query += ` AND d.title LIKE ?`;
            params.push(`%${title}%`);
        }

        query += ` ORDER BY d.created_at DESC`;

        db.all(query, params, async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Map rows to documents with stakeholders
                const documentsPromises = rows.map(async row => {
                    const document = new Document();
                    document.createFromDatabaseRow(row);
                    const stakeholders = await getDocumentStakeholders(row.id);
                    document.stakeholders = stakeholders.map(s => s.stakeholder);
                    return document;
                });

                // Wait for all documents to be processed
                const documents = await Promise.all(documentsPromises);
                resolve(documents);
            }
        });
    });
}

export {
    addDocument,
    addDocumentStakeholder,
    addDocumentConnection,
    getAllDocuments,
    getDocumentStakeholders,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections,
    deleteAllStakeholders
};