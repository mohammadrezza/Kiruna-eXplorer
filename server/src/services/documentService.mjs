import {getAllDocuments, getDocumentWithConnections} from "../db/db.mjs";

async function getDocuments(documentId, title) {
    const documents = await getAllDocuments();
    return documents;
}

async function getDocument(id) {
    try {
        const rows = await getDocumentWithConnections(id);

        if (!rows || rows.length === 0) {
            return null;
        }

        // Format the main document
        const mainDocument = {
            id: rows[0].doc_id,
            title: rows[0].doc_title,
            stakeholders: rows[0].doc_stakeholders,
            scale: rows[0].doc_scale,
            issuanceDate: rows[0].doc_issuanceDate,
            type: rows[0].doc_type,
            language: rows[0].doc_language,
            coordinates: rows[0].doc_coordinates ? JSON.parse(rows[0].doc_coordinates) : [],
            connections: []
        };

        // Add connections if they exist
        rows.forEach(row => {
            if (row.conn_id) {
                mainDocument.connections.push({
                    id: row.conn_id,
                    title: row.conn_title,
                    stakeholders: row.conn_stakeholders,
                    scale: row.conn_scale,
                    issuanceDate: row.conn_issuanceDate,
                    type: row.conn_type,
                    language: row.conn_language,
                    coordinates: row.conn_coordinates ? JSON.parse(row.conn_coordinates) : []
                });
            }
        });

        return mainDocument;
    } catch (error) {
        throw new Error(`Error fetching document: ${error.message}`);
    }
}

export {
    getDocument,
    getDocuments
}