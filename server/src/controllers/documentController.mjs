import DocumentType from "../components/documentType.mjs";
import DocumentConnectionType from "../components/documentConnectionType.mjs";
import Stakeholder from "../components/stakeholder.mjs";

import fs from 'fs/promises';

import path from 'path';


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

async function documentConnectionTypesList(req, res) {
    res.status(200).json({documentConnectionTypes: Object.values(DocumentConnectionType)});

}

async function getStakeholdersList(req, res) {
    res.status(200).json({stakeholders: Object.values(Stakeholder)});
}

async function documentsList(req, res) {
    try {
        const { documentId, title } = req.query;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;

        // Validate pagination parameters
        if (page < 1 || size < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters'
            });
        }

        const result = await getDocuments(documentId, title, page, size);

        return res.status(200).json({
            success: true,
            ...result
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

    const previousDocument = await getDocument(documentId);
    if (!previousDocument) {
        return res.status(404).json({
            success: false,
            message: 'Document not found'
        });
    }
    
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

async function uploadDocument(req, res) {
    try {
        const { documentId } = req.params;
        const { file } = req;

        
        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'File is required'
            });
        }

       
        const uploadsDirectory = path.join(process.cwd(), 'uploads', documentId);
        
        
        await fs.mkdir(uploadsDirectory, { recursive: true });

       
        const filePath = path.join(uploadsDirectory, file.filename);

    
        await fs.rename(file.path, filePath);

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            documentId: documentId,
            filePath: filePath
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
export {
    createDocument,
    documentTypesList,
    documentsList,
    documentConnectionTypesList,
    getStakeholdersList,
    getDocumentWithId,
    uploadDocument
}