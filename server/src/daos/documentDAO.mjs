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
 * @param {array} area - document coordinates
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
    area,
    connections
) {
    return new Promise((resolve, reject) => {
        const query =
            "INSERT INTO Document (id, title, description, scale, issuanceDate, type, language, coordinates, area, connections) VALUES (?,?,?,?,?,?,?,?,?,?)";
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
                JSON.stringify(area),
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
            "INSERT INTO DocumentStakeholder (id, documentId, stakeholder) VALUES (?,?,?)";
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
            WHERE documentId = ?
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
    area,
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
                area = COALESCE(?, area),
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
                JSON.stringify(area),
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
            WHERE documentId = ?
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
                d.area as doc_area,
                cd.id as conn_id,
                cd.title as conn_title,
                cd.scale as conn_scale,
                cd.issuanceDate as conn_issuanceDate,
                cd.language as conn_language,
                cd.coordinates as conn_coordinates,
                cd.area as conn_area,
                dc.type as connection_type,
                cd.type as conn_doc_type,
                (
                    SELECT COUNT(*)
                    FROM DocumentConnection dc2
                    WHERE dc2.documentId = cd.id OR dc2.connectionId = cd.id
                ) as conn_total_connections
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

async function getAllDocuments(
    documentId,
    title,
    page,
    size,
    sort,
    documentTypes,
    stakeholders,
    issuanceDateStart,
    issuanceDateEnd
) {
    return new Promise(async (resolve, reject) => {
        try {
            // Calculate offset
            const offset = (page - 1) * size;

            // Base query for total count
            let countQuery = `
                SELECT COUNT(DISTINCT d.id) as total
                FROM Document d
                         LEFT JOIN DocumentStakeholder ds ON d.id = ds.documentId
                WHERE 1=1
            `;

            // Base query for fetching documents
            let query = `
                SELECT DISTINCT
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
                         LEFT JOIN DocumentStakeholder ds ON d.id = ds.documentId
                WHERE 1=1
            `;

            const params = [];
            const countParams = [];

            // Add filters
            if (documentId) {
                params.push(documentId, documentId, documentId);
                query += ` AND d.id != ?`;
                params.push(documentId);

                countQuery += ` AND d.id != ?`;
                countParams.push(documentId);
            } else {
                params.push(null, null, null);
            }

            // Title filter
            if (title) {
                query += ` AND d.title LIKE ?`;
                params.push(`%${title}%`);

                countQuery += ` AND d.title LIKE ?`;
                countParams.push(`%${title}%`);
            }

            // Document Type filter
            if (documentTypes && documentTypes.length > 0) {
                query += ` AND d.type IN (${documentTypes.map(() => '?').join(',')})`;
                params.push(...documentTypes);

                countQuery += ` AND d.type IN (${documentTypes.map(() => '?').join(',')})`;
                countParams.push(...documentTypes);
            }

            // Stakeholders filter
            if (stakeholders && stakeholders.length > 0) {
                query += ` AND ds.stakeholder IN (${stakeholders.map(() => '?').join(',')})`;
                params.push(...stakeholders);

                countQuery += ` AND ds.stakeholder IN (${stakeholders.map(() => '?').join(',')})`;
                countParams.push(...stakeholders);
            }

            if (issuanceDateStart && !issuanceDateEnd) {
                query += ` AND (
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
        ) AND (
            substr(d.issuanceDate, 1, 2) IN ('00', substr(?, 1, 2)) 
            AND substr(d.issuanceDate, 4, 2) IN ('00', substr(?, 4, 2)) 
            OR d.issuanceDate = ?
        )
    )`;
                params.push(
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart
                );

                countQuery += ` AND (
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
        ) AND (
            substr(d.issuanceDate, 1, 2) IN ('00', substr(?, 1, 2)) 
            AND substr(d.issuanceDate, 4, 2) IN ('00', substr(?, 4, 2)) 
            OR d.issuanceDate = ?
        )
    )`;
                countParams.push(
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart
                );
            }

            // Issuance Date Range filter
            if (issuanceDateStart && issuanceDateEnd) {
                query += ` AND (
    (
        -- Exact date match within the range
        d.issuanceDate BETWEEN ? AND ?
    ) OR (
        -- Match years with date and month as '00'
        (
            substr(d.issuanceDate, 7, 4) BETWEEN substr(?, 7, 4) AND substr(?, 7, 4)
            AND substr(d.issuanceDate, 1, 2) = '00'
            AND substr(d.issuanceDate, 4, 2) = '00'
        )
    ) OR (
        -- Match specific year and month range with date as '00'
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
            AND substr(d.issuanceDate, 1, 2) = '00'
            AND substr(d.issuanceDate, 4, 2) BETWEEN substr(?, 4, 2) AND substr(?, 4, 2)
        )
    ) OR (
        -- Match specific year and month with partial date match
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
            AND substr(d.issuanceDate, 4, 2) = substr(?, 4, 2)
            AND (
                substr(d.issuanceDate, 1, 2) = '00' 
                OR substr(d.issuanceDate, 1, 2) BETWEEN substr(?, 1, 2) AND substr(?, 1, 2)
            )
        )
    )
)`;
                params.push(
                    // Exact date range params
                    issuanceDateStart,
                    issuanceDateEnd,

                    // Year '00' params
                    issuanceDateStart,
                    issuanceDateEnd,

                    // Year and month '00' params
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateEnd,

                    // Year and month partial match params
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateEnd
                );

                // Similar modification for countQuery
                countQuery += ` AND (
    (
        -- Exact date match within the range
        d.issuanceDate BETWEEN ? AND ?
    ) OR (
        -- Match years with date and month as '00'
        (
            substr(d.issuanceDate, 7, 4) BETWEEN substr(?, 7, 4) AND substr(?, 7, 4)
            AND substr(d.issuanceDate, 1, 2) = '00'
            AND substr(d.issuanceDate, 4, 2) = '00'
        )
    ) OR (
        -- Match specific year and month range with date as '00'
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
            AND substr(d.issuanceDate, 1, 2) = '00'
            AND substr(d.issuanceDate, 4, 2) BETWEEN substr(?, 4, 2) AND substr(?, 4, 2)
        )
    ) OR (
        -- Match specific year and month with partial date match
        (
            substr(d.issuanceDate, 7, 4) = substr(?, 7, 4)
            AND substr(d.issuanceDate, 4, 2) = substr(?, 4, 2)
            AND (
                substr(d.issuanceDate, 1, 2) = '00' 
                OR substr(d.issuanceDate, 1, 2) BETWEEN substr(?, 1, 2) AND substr(?, 1, 2)
            )
        )
    )
)`;
                countParams.push(
                    // Same params as above
                    issuanceDateStart,
                    issuanceDateEnd,
                    issuanceDateStart,
                    issuanceDateEnd,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateEnd,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateStart,
                    issuanceDateEnd
                );
            }

            // Sorting
            if (sort) {
                const [sortColumn, sortOrder] = sort.split(',');
                // Whitelist of allowed columns to prevent SQL injection
                const allowedColumns = ['title', 'issuanceDate', 'type', 'created_at'];
                const allowedOrders = ['asc', 'desc'];

                if (sortColumn === 'issuanceDate' &&
                    allowedOrders.includes(sortOrder.toLowerCase())) {
                    // Custom sorting for issuanceDate
                    query += ` ORDER BY 
            CAST(substr(d.issuanceDate, 7, 4) AS INTEGER) ${sortOrder.toUpperCase()},
            CAST(substr(d.issuanceDate, 4, 2) AS INTEGER) ${sortOrder.toUpperCase()},
            CAST(substr(d.issuanceDate, 1, 2) AS INTEGER) ${sortOrder.toUpperCase()}`;
                } else if (
                    allowedColumns.includes(sortColumn) &&
                    allowedOrders.includes(sortOrder.toLowerCase())
                ) {
                    query += ` ORDER BY d.${sortColumn} ${sortOrder.toUpperCase()}`;
                } else {
                    query += ` ORDER BY d.created_at DESC`;
                }
            } else {
                query += ` ORDER BY d.created_at DESC`;
            }

            // Add pagination
            query += ` LIMIT ? OFFSET ?`;
            params.push(size, offset);

            // Get total count
            const totalCount = await new Promise((resolveCount, rejectCount) => {
                db.get(countQuery, countParams, (err, row) => {
                    if (err) {
                        rejectCount(err);
                    } else {
                        resolveCount(row.total);
                    }
                });
            });

            // Get paginated documents
            const rows = await new Promise((resolveRows, rejectRows) => {
                db.all(query, params, (err, rows) => {
                    if (err) {
                        rejectRows(err);
                    } else {
                        resolveRows(rows);
                    }
                });
            });

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

            // Calculate pagination metadata
            const totalPages = Math.ceil(totalCount / size);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            resolve({
                data: documents,
                pagination: {
                    total: totalCount,
                    totalPages,
                    currentPage: page,
                    size,
                    hasNextPage,
                    hasPreviousPage
                }
            });

        } catch (error) {
            reject(error);
        }
    });
}


async function addType(type) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Type (id, name) VALUES (?, ?)`;

        db.run(query, [type.id, type.name], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getAllTypes() {
    return new Promise((resolve, reject) => {
        const query = `SELECT name FROM Type`;

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

async function addStakeHolder(stakeholder) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Stakeholder (id, name) VALUES (?, ?)`;

        db.run(query, [stakeholder.id, stakeholder.name], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getAllStakeHolders() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Stakeholder`;

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

async function addScale(scale) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Scale (id, name) VALUES (?, ?)`;

        db.run(query, [scale.id, scale.name], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getAllScales() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Scale`;

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
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
    deleteAllStakeholders,
    addType,
    getAllTypes,
    addStakeHolder,
    getAllStakeHolders,
    addScale,
    getAllScales,
};