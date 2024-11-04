import Document from "../components/document.mjs";
import DocumentConnection from "../components/documentConnection.mjs";
import {addDocument, addDocumentConnection, editDocument, editDocumentConnection, deleteAllConnections} from "../db/db.mjs";
import DocumentType from "../components/documentType.mjs";
import {getDocuments, getDocument} from "../services/documentService.mjs";

async function createDocument(req, res) {
    const {
        title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connectionIds,
    } = req.body;

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

        let connectionPromises = []
        for (const connection of connections) {
            connectionPromises.push(addDocumentConnection(
                connection.id,
                connection.documentId,
                connection.connectionId
            ));
        }
        await Promise.all(connectionPromises);

        res
            .status(201)
            .json({message: "Document successfully created", data: req.body});
    } catch (error) {

        console.error("Failed to create document in database:", error);
        res.status(500).json({message: "Failed to create document"});

    }
}

async function getDocumentWithId(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const document = await getDocument(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function documentTypesList(req, res) {
    res.status(200).json({documentTypes: Object.values(DocumentType)});
}

async function documentsList(req, res) {
    const {documentId, title} = req.query;
    const documents = await getDocuments(documentId, title);
    res.status(200).json({documents: documents});
}

export const updateDocument = async (req, res) => {
    const { documentId } = req.params;
    const {
        title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connectionIds,
    } = req.body;

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

        res
            .status(201)
            .json({ message: "Document successfully updated", data: req.body });
    } catch (error) {
        console.error("Failed to update document in database:", error);
        res.status(500).json({ message: "Failed to update document" });
    }
};

export {
    createDocument,
    documentTypesList,
    documentsList,
    getDocumentWithId
}