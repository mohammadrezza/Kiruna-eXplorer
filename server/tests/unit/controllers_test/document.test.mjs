import {
    createDocument,
    documentsList,
    updateDocument,
    getDocumentWithId,
    documentTypesList,
    documentConnectionTypesList,
    getStakeholdersList
} from '../../../src/controllers/documentController.mjs';
import DocumentType from "../../../src/components/documentType.mjs";
import * as documentService from "../../../src/services/documentService.mjs";

jest.mock('../../../src/services/documentService.mjs')

describe('Document Controller', () => {
    // Reset mocks after each test
    afterEach(() => {
        jest.clearAllMocks()
    });

    // Create Document Tests
    describe('createDocument', () => {
        test("successful creation of a document with no connections", async () => {
            const mockDocument = {
                title: 'Test Document',
                description: 'Test Description',
                stakeholders: ['Stakeholder1'],
                scale: 'Large',
                issuanceDate: '2023-01-01',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'English',
                coordinates: '[1.1, 2.2]',
                connectionIds: []
            };

            // Mock the postDocument service method
            jest.spyOn(documentService, 'postDocument').mockResolvedValue(mockDocument);

            // Mock response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Call the controller method
            await createDocument({
                body: mockDocument
            }, mockRes);

            // Assertions
            expect(documentService.postDocument).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockDocument
            });
        });

        test("document creation fails", async () => {
            const mockDocument = {
                title: 'Test Document',
                // ... other fields
            };

            // Mock postDocument to return null (failure scenario)
            jest.spyOn(documentService, 'postDocument').mockResolvedValue(null);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createDocument({
                body: mockDocument
            }, mockRes);

            expect(documentService.postDocument).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Bad request'
            });
        });
    });

    // Get Document Tests
    describe('getDocumentWithId', () => {
        test("successful retrieval of a document", async () => {
            const mockDocument = {
                id: '1',
                title: 'Test Document'
            };

            jest.spyOn(documentService, 'getDocument').mockResolvedValue(mockDocument);

            const mockReq = { params: { id: '1' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getDocumentWithId(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('1');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockDocument
            });
        });

        test("document not found", async () => {
            jest.spyOn(documentService, 'getDocument').mockResolvedValue(null);

            const mockReq = { params: { id: '999' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getDocumentWithId(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('999');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document not found'
            });
        });

        test("missing document ID", async () => {
            const mockReq = { params: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getDocumentWithId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document ID is required'
            });
        });
    });

    // Documents List Tests
    describe('documentsList', () => {
        test("successful retrieval of documents with pagination", async () => {
            const mockDocuments = {
                documents: [
                    { id: '1', title: 'Document 1' },
                    { id: '2', title: 'Document 2' }
                ],
                total: 2,
                page: 1,
                size: 10
            };

            jest.spyOn(documentService, 'getDocuments').mockResolvedValue(mockDocuments);

            const mockReq = {
                query: {
                    page: '1',
                    size: '10'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await documentsList(mockReq, mockRes);

            expect(documentService.getDocuments).toHaveBeenCalledWith(undefined, undefined, 1, 10);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                ...mockDocuments
            });
        });

        test("invalid pagination parameters", async () => {
            const mockReq = {
                query: {
                    page: '0',
                    size: '-1'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await documentsList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid pagination parameters'
            });
        });
    });

    // Update Document Tests
    describe('updateDocument', () => {
        test("successful document update", async () => {
            const mockDocument = {
                id: '1',
                title: 'Updated Document',
                description: 'Updated Description'
            };

            jest.spyOn(documentService, 'getDocument').mockResolvedValue(mockDocument);
            jest.spyOn(documentService, 'putDocument').mockResolvedValue(mockDocument);

            const mockReq = {
                params: { documentId: '1' },
                body: mockDocument
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateDocument(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('1');
            expect(documentService.putDocument).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockDocument
            });
        });

        test("document update fails - document not found", async () => {
            jest.spyOn(documentService, 'getDocument').mockResolvedValue(null);

            const mockReq = {
                params: { documentId: '999' },
                body: {}
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateDocument(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('999');
            expect(documentService.putDocument).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document not found'
            });
        });
    });

    // Additional List Endpoint Tests
    describe('List Endpoints', () => {
        test("documentTypesList returns all document types", async () => {
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await documentTypesList(null, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                documentTypes: expect.any(Array)
            });
        });

        test("documentConnectionTypesList returns all connection types", async () => {
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await documentConnectionTypesList(null, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                documentConnectionTypes: expect.any(Array)
            });
        });

        test("getStakeholdersList returns all stakeholders", async () => {
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getStakeholdersList(null, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                stakeholders: expect.any(Array)
            });
        });
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        test("createDocument handles service error", async () => {
            jest.spyOn(documentService, 'postDocument').mockRejectedValue(new Error('Service Error'));

            const mockReq = { body: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createDocument(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: 'Service Error'
            });
        });
    });
});