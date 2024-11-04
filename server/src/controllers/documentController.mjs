//import Document from "../components/document.mjs";
//import DocumentConnection from "../components/documentConnection.mjs";


import DocumentType from "../components/documentType.mjs";
import {getDocuments, getDocument, postDocument, putDocument} from "../services/documentService.mjs";

async function createDocument(req, res) {
try {
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

    const document = await postDocument(title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connectionIds);

    if (!document) {
        return res.status(400).json({
            success: false,
            message: 'Bad request'
        });
    }

    return res.status(201).json({
        success: true,
        data: document
    });

} catch (error){
    console.error('Error:', error);
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
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

try{
    const document = await putDocument(documentId, title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connectionIds);

        if (!document) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }
    
        return res.status(200).json({
            success: true,
            data: document
        });
    
    }catch(error) {
        
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export {
    createDocument,
    documentTypesList,
    documentsList,
    getDocumentWithId
}