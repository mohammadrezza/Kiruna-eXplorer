import {
    addDocument,
    addDocumentConnection,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections,
    getAllDocuments
} from "../daos/documentDAO.mjs";
import Document from "../components/document.mjs";
import DocumentConnection from "../components/documentConnection.mjs";

async function getDocuments(documentId, title) {
    return await getAllDocuments(documentId, title);
}

async function postDocument(
    title,
    description,
    stakeholders,
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connectionIds) {

    //creation logic
    const document = new Document();
    document.createFromObject({
        title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connections: connectionIds.length,
    });

    let connections = []
    for (const connectionId of connectionIds) {
        let documentConnection = new DocumentConnection();
        documentConnection.createFromObject({
            documentId: document.id,
            connectionId,
        });
        connections.push(documentConnection)
    }

    try {
        await addDocument(
            document.id,
            title,
            description,
            stakeholders,
            scale,
            issuanceDate,
            type,
            language,
            coordinates,
            connectionIds.length
        );

        let connectionPromises = [];
        for (const connection of connections) {
            connectionPromises.push(addDocumentConnection(
                connection.id,
                connection.documentId,
                connection.connectionId
            ));
        }
        await Promise.all(connectionPromises);

        return ({message: "Document successfully created", data: document});

    } catch (error) {

        throw new Error(`Error creating document: ${error.message}`);

    }
}

async function putDocument(
    documentId,
    title,
    description,
    stakeholders,
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connectionIds) {

    const document = new Document();
    document.createFromObject({
        documentId,
        title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connections: connectionIds.length,
    });
    let connections = [];
    for (const connectionId of connectionIds) {
        let documentConnection = new DocumentConnection();
        documentConnection.createFromObject({
            documentId: documentId,
            connectionId,
        });
        connections.push(documentConnection);
    }

    try {

        await editDocument(documentId, title, description, stakeholders, scale, issuanceDate, type, language, coordinates, connectionIds.length);

        await deleteAllConnections(documentId);

        let connectionPromises = [];
        for (const connection of connections) {
            connectionPromises.push(editDocumentConnection(
                connection.id,
                connection.documentId,
                connection.connectionId
            ));
        }
        await Promise.all(connectionPromises);
        return ({message: "Document successfully updated", data: document});

    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);
    }
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
            description: rows[0].doc_description,
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
                    description: row.conn_description,
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
    getDocuments,
    postDocument,
    putDocument
}