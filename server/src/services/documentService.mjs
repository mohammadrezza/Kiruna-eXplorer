import {
    addDocument,
    addDocumentConnection,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections,
    getAllDocuments, addDocumentStakeholder, deleteAllStakeholders, getDocumentStakeholders
} from "../daos/documentDAO.mjs";
import fs from 'fs/promises';
import Document from "../components/document.mjs";
import DocumentConnection from "../components/documentConnection.mjs";
import DocumentStakeholder from "../components/documentStakeholder.mjs";

async function getDocuments(documentId, title, page, size) {
    return await getAllDocuments(documentId, title, page, size);
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
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connections: connectionIds.length,
    });

    let documentStakeholders = [];
    for (const stakeholder of stakeholders) {
        let docStakeholder = new DocumentStakeholder();
        docStakeholder.createFromObject({
            documentId: document.id,
            stakeholder: stakeholder
        });
        documentStakeholders.push(docStakeholder);
    }

    let connections = []
    for (const connectionId of connectionIds) {
        let documentConnection = new DocumentConnection();
        documentConnection.createFromObject({
            documentId: document.id,
            connectionId: connectionId.id, 
            type: connectionId.type
        });
        connections.push(documentConnection)
    }

    try {
        await addDocument(
            document.id,
            title,
            description,
            scale,
            issuanceDate,
            type,
            language,
            coordinates,
            connectionIds.length
        );

        let stakeholderPromises = [];
        for (const docStakeholder of documentStakeholders) {
            stakeholderPromises.push(addDocumentStakeholder(
                docStakeholder.id,
                docStakeholder.documentId,
                docStakeholder.stakeholder
            ));
        }
        await Promise.all(stakeholderPromises);

        let connectionPromises = [];
        for (const connection of connections) {
            connectionPromises.push(addDocumentConnection(
                connection.id,
                connection.documentId,
                connection.connectionId,
                connection.type
            ));
        }
        await Promise.all(connectionPromises);

        document.stakeholders = stakeholders;

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
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connections: connectionIds.length,
    });

    let documentStakeholders = [];
    for (const stakeholder of stakeholders) {
        let docStakeholder = new DocumentStakeholder();
        docStakeholder.createFromObject({
            documentId: documentId,
            stakeholder: stakeholder
        });
        documentStakeholders.push(docStakeholder);
    }

    let connections = [];
    for (const connectionId of connectionIds) {
        let documentConnection = new DocumentConnection();
        documentConnection.createFromObject({
            documentId: documentId,
            connectionId:connectionId.id,
            type: connectionId.type
        });
        connections.push(documentConnection);
    }

    try {

        await editDocument(documentId, title, description, scale, issuanceDate, type, language, coordinates, connectionIds.length);

        await deleteAllStakeholders(documentId);
        let stakeholderPromises = [];
        for (const docStakeholder of documentStakeholders) {
            stakeholderPromises.push(addDocumentStakeholder(
                docStakeholder.id,
                docStakeholder.documentId,
                docStakeholder.stakeholder
            ));
        }
        await Promise.all(stakeholderPromises);

        await deleteAllConnections(documentId);

        let connectionPromises = [];
        for (const connection of connections) {
            connectionPromises.push(editDocumentConnection(
                connection.id,
                connection.documentId,
                connection.connectionId,
                connection.type
            ));
        }
        await Promise.all(connectionPromises);

        document.stakeholders = stakeholders;

        return ({message: "Document successfully updated", data: document});

    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);
    }
}

async function getDocument(id) {
    try {
        const documentData = await getDocumentWithConnections(id);
        const stakeholders = await getDocumentStakeholders(id);

        if (!documentData || documentData.length === 0) {
            return null;
        }

        const files  = await fs.readdir(`uploads/${id}`);
        files.forEach((file, index) => {
            files[index] = `server/uploads/${id}/${file}`;
        })
        // Format the main document
        const mainDocument = {
            id: documentData[0].doc_id,
            title: documentData[0].doc_title,
            description: documentData[0].doc_description,
            stakeholders: stakeholders.map(s => s.stakeholder),
            scale: documentData[0].doc_scale,
            issuanceDate: documentData[0].doc_issuanceDate,
            type: documentData[0].doc_type,
            language: documentData[0].doc_language,
            coordinates: documentData[0].doc_coordinates ? JSON.parse(documentData[0].doc_coordinates) : [],
            connections: [],
            files: files
        };

        // Add connections if they exist
        for (const row of documentData) {
            if (row.conn_id) {
                const connStakeholders = await getDocumentStakeholders(row.conn_id);
                mainDocument.connections.push({
                    connectionType: row.conn_type,
                    id: row.conn_id,
                    title: row.conn_title,
                    description: row.conn_description,
                    stakeholders: connStakeholders.map(s => s.stakeholder),
                    scale: row.conn_scale,
                    issuanceDate: row.conn_issuanceDate,
                    type: row.conn_type,
                    language: row.conn_language,
                    coordinates: row.conn_coordinates ? JSON.parse(row.conn_coordinates) : []
                });
            }
        }

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