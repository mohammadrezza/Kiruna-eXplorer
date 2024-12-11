import {
    getDocuments,
    getDocument,
    postDocumentType,
    getDocumentTypes,
    getStakeholders,
    getScales,
    postStakeholder,
    postScale,
    postDocument,
    putDocument,
    postFile,
    getFile,
    removeFile
} from "../services/documentService.mjs";
import DocumentConnectionType from "../components/documentConnectionType.mjs";

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
            area,
            connectionIds,
        } = req.body;

        if ((area.length >= 2 && Object.keys(coordinates).length > 0) ||
            (area.length === 0 && Object.keys(coordinates).length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Either area or coordinates must be provided'
            })
        }
        const document = await postDocument(title,
            description,
            stakeholders,
            scale,
            issuanceDate,
            type,
            language,
            coordinates,
            area,
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

    } catch (error) {
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
        const {id} = req.params;

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

async function documentConnectionTypesList(req, res) {
    res.status(200).json({documentConnectionTypes: Object.values(DocumentConnectionType)});
}

async function documentsList(req, res) {
    try {
        const {
            documentId,
            title,
            page = 1,
            size = 10,
            sort,
            documentTypes,
            stakeholders,
            issuanceDateStart,
            issuanceDateEnd
        } = req.query;

        // Validate pagination parameters
        if (page < 1 || size < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters'
            });
        }

        // Convert comma-separated strings to arrays
        const processedDocumentTypes = documentTypes
            ? documentTypes.split(',').map(type => type.trim())
            : null;
        const processedStakeholders = stakeholders
            ? stakeholders.split(',').map(stakeholder => stakeholder.trim())
            : null;

        const result = await getDocuments(
            documentId,
            title,
            page,
            size,
            sort,
            processedDocumentTypes,
            processedStakeholders,
            issuanceDateStart,
            issuanceDateEnd
        );

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

async function updateDocument(req, res) {

    const {documentId} = req.params;
    const {
        title,
        description,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        area,
        connectionIds,
    } = req.body;

    try {
        if ((area.length >= 2 && Object.keys(coordinates).length > 0) ||
            (area.length === 0 && Object.keys(coordinates).length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Either area or coordinates must be provided'
            })
        }

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
            area,
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

    } catch (error) {

        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function createDocumentType(req, res) {
    const types = await getDocumentTypes()
    if (types.includes(req.body.name)) {
        res.status(400).json({message: "Document type already exists"})
        return
    }
    await postDocumentType(req.body.name)
    return res.status(200).send()
}

async function getDocumentTypesList(req, res) {
    const types = await getDocumentTypes()
    res.status(200).json({
        success: true,
        data: types
    })
}

async function createStakeholder(req, res) {
    const stakeholders = await getStakeholders()
    if (stakeholders.includes(req.body.name)) {
        res.status(400).json({message: "Stakeholder already exists"})
        return
    }
    await postStakeholder(req.body.name)
    return res.status(200).send()
}

async function getStakeholdersList(req, res) {
    const stakeholders = await getStakeholders()
    res.status(200).json({
        success: true,
        data: stakeholders
    })
}

async function createScale(req, res) {
    const scales = await getScales()
    if (scales.includes(req.body.name)) {
        res.status(400).json({message: "Scale already exists"})
        return
    }
    await postScale(req.body.name)
    return res.status(200).send()
}

async function getScalesList(req, res) {
    const scales = await getScales()
    res.status(200).json({
        success: true,
        data: scales
    })
}

async function uploadFile(req, res) {
    try {
        const {documentId} = req.params;
        const {file} = req;

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

        const fileLink = await postFile(documentId, file)
        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            documentId: documentId,
            file: fileLink
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

async function downloadFile(req, res) {
    const {documentId, fileName} = req.params;

    if (!documentId || !fileName) {
        return res.status(400).json({
            success: false,
            message: 'Document ID and file name are required'
        });
    }

    const filePath = await getFile(documentId, fileName);
    if (!filePath) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }

    res.download(filePath, fileName);
}

async function deleteFile(req, res) {
    const {documentId, fileName} = req.params;

    if (!documentId || !fileName) {
        return res.status(400).json({
            success: false,
            message: 'Document ID and file name are required'
        });
    }

    if (await removeFile(documentId, fileName) === false) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'File deleted successfully'
    });
}

export {
    createDocument,
    updateDocument,
    documentsList,
    getDocumentWithId,
    documentConnectionTypesList,
    createStakeholder,
    getStakeholdersList,
    createDocumentType,
    getDocumentTypesList,
    createScale,
    getScalesList,
    uploadFile,
    downloadFile,
    deleteFile
}