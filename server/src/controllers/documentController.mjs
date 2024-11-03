import Document from "../components/document.mjs";
import DocumentConnection from "../components/documentConnection.mjs";
import {addDocument, addDocumentConnection, editDocument, editDocumentConnection, deleteAllConnections} from "../db/db.mjs";

export const createDocument = async (req, res) => {
    const {
        title,
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
};

export const updateDocument = async (req, res) => {
    const { documentId } = req.params;
    const {
        title,
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

        await editDocument(documentId, title, stakeholders, scale, issuanceDate, type, language, coordinates, connectionIds.length);

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