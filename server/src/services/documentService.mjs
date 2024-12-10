import {
    addDocument,
    addDocumentConnection,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections,
    getAllDocuments,
    addDocumentStakeholder,
    deleteAllStakeholders,
    getDocumentStakeholders,
    addType,
    getAllTypes,
    addScale,
    addStakeHolder,
    getAllStakeHolders,
    getAllScales
} from "../daos/documentDAO.mjs";
import fs from 'fs';
import Document from "../components/document.mjs";
import DocumentConnection from "../components/documentConnection.mjs";
import DocumentStakeholder from "../components/documentStakeholder.mjs";
import DocumentType from "../components/documentType.mjs";
import Scale from "../components/scale.mjs";
import Stakeholder from "../components/stakeholder.mjs";

async function getDocuments(
    documentId,
    keyword,
    page,
    size,
    sort,
    documentTypes,
    stakeholders,
    issuanceDateStart,
    issuanceDateEnd
) {
    return await getAllDocuments(
        documentId,
        keyword,
        page,
        size,
        sort,
        documentTypes,
        stakeholders,
        issuanceDateStart,
        issuanceDateEnd
    );
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
    area,
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
        area,
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
            area,
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
    area,
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
        area,
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
            connectionId: connectionId.id,
            type: connectionId.type
        });
        connections.push(documentConnection);
    }

    try {

        await editDocument(documentId, title, description, scale, issuanceDate, type, language, coordinates, area, connectionIds.length);

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

        let files = []
        if (fs.existsSync(`uploads/${id}`)) {
            files = fs.readdirSync(`uploads/${id}`);
            files.forEach((fileName, index) => {
                files[index] = `http://localhost:3001/documents/${id}/files/${fileName}`
            })
        }

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
            area: documentData[0].doc_area ? JSON.parse(documentData[0].doc_area) : [],
            connections: [],
            files: files
        };

        // Add connections if they exist
        for (const row of documentData) {
            if (row.conn_id) {
                const connStakeholders = await getDocumentStakeholders(row.conn_id);
                mainDocument.connections.push({
                    connectionType: row.connection_type,
                    id: row.conn_id,
                    title: row.conn_title,
                    description: row.conn_description,
                    stakeholders: connStakeholders.map(s => s.stakeholder),
                    scale: row.conn_scale,
                    issuanceDate: row.conn_issuanceDate,
                    type: row.conn_doc_type,
                    language: row.conn_language,
                    connections: row.conn_total_connections,
                    coordinates: row.conn_coordinates ? JSON.parse(row.conn_coordinates) : [],
                    area: row.conn_area ? JSON.parse(row.conn_area) : []
                });
            }
        }

        return mainDocument;
    } catch (error) {
        throw new Error(`Error fetching document: ${error.message}`);
    }
}

async function postDocumentType(name) {
    const type = new DocumentType();
    type.createFromObject({
        name: name
    });
    await addType(type);
}

async function getDocumentTypes() {
    const rows = await getAllTypes();
    const documentTypes = [];
    for (const row of rows) {
        const type = new DocumentType();
        type.createFromDatabaseRow(row);
        documentTypes.push(type.name);
    }
    return documentTypes;
}

async function postStakeholder(name) {
    const stakeholder = new Stakeholder();
    stakeholder.createFromObject({
        name: name
    });
    await addStakeHolder(stakeholder);
}

async function getStakeholders() {
    const rows = await getAllStakeHolders();
    const stakeholders = [];
    for (const row of rows) {
        const stakeholder = new Stakeholder();
        stakeholder.createFromDatabaseRow(row);
        stakeholders.push(stakeholder.name);
    }
    return stakeholders;
}

async function postScale(name) {
    const scale = new Scale();
    scale.createFromObject({
        name: name
    });
    await addScale(scale);
}

async function getScales() {
    const rows = await getAllScales();
    const scales = [];
    for (const row of rows) {
        const scale = new Scale();
        scale.createFromDatabaseRow(row);
        scales.push(scale.name);
    }
    return scales;

}

export {
    getDocument,
    getDocuments,
    postDocument,
    putDocument,
    postDocumentType,
    getDocumentTypes,
    postStakeholder,
    getStakeholders,
    postScale,
    getScales
}