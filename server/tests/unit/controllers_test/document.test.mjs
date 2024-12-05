import {
    createDocument,
    documentsList,
    updateDocument,
    getDocumentWithId,
    getDocumentTypesList,
    documentConnectionTypesList,
    getStakeholdersList, 
    createDocumentType, 
    createStakeholder,
    createScale,
    getScalesList,
    uploadFile,
    downloadFile,
    deleteFile
} from '../../../src/controllers/documentController.mjs';
import DocumentType from "../../../src/components/documentType.mjs";
import * as documentService from "../../../src/services/documentService.mjs";
import fs from 'fs';
import path from 'path';

jest.mock('../../../src/services/documentService.mjs')
jest.mock('fs');
jest.mock('sqlite3', () => {
    const mockDatabase = {
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn(),
        exec: jest.fn(),
        close: jest.fn()
    };
    const mockSqlite3 = {
        Database: jest.fn(() => mockDatabase)
    };
    return mockSqlite3;
});

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
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
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
                description: 'Test Description',
                stakeholders: ['Stakeholder1'],
                scale: 'Large',
                issuanceDate: '2023-01-01',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'English',
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
                connectionIds: []
            };

            // Mock postDocument to throw an error (failure scenario)
            jest.spyOn(documentService, 'postDocument').mockRejectedValue(new Error('Service Error'));

            const mockReq = {
                body: mockDocument
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createDocument(mockReq, mockRes);

            expect(documentService.postDocument).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: 'Service Error'
            });
        });
        test('should return 400 if both area and coordinates are provided', async () => {
            const mockReq = {
                body: {
                    title: 'Test Document',
                    description: 'Test Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: ['Area1', 'Area2'],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createDocument(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Either area or coordinates must be provided'
            });
        });

        test('should return 400 if neither area nor coordinates are provided', async () => {
            const mockReq = {
                body: {
                    title: 'Test Document',
                    description: 'Test Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: {},
                    area: [],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createDocument(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Either area or coordinates must be provided'
            });
        });

        test('should return 400 if document creation fails', async () => {
            const mockReq = {
                body: {
                    title: 'Test Document',
                    description: 'Test Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: ['Area1'],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            documentService.postDocument.mockResolvedValue(null);

            await createDocument(mockReq, mockRes);

            expect(documentService.postDocument).toHaveBeenCalledWith(
                'Test Document',
                'Test Description',
                ['Stakeholder1'],
                'Large',
                '2023-01-01',
                'Type1',
                'English',
                { lat: 1.1, lng: 2.2 },
                ['Area1'],
                []
            );
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Bad request'
            });
        });













    });

    // Get Document Tests
    describe('getDocumentWithId', () => {

        test('should return 500 when an internal server error occurs', async () => {
            const mockReq = {
                params: { id: 'valid-id' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const errorMessage = 'Internal server error';
            documentService.getDocument.mockRejectedValue(new Error(errorMessage));

            await getDocumentWithId(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('valid-id');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: errorMessage
            });
        });








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

        test('should return 500 when an internal server error occurs', async () => {
            const mockReq = {
                query: {
                    documentId: 'doc1',
                    title: 'Test Document',
                    page: '1',
                    size: '10',
                    sort: 'title,asc',
                    documentTypes: 'Type1,Type2',
                    stakeholders: 'Stakeholder1,Stakeholder2',
                    issuanceDateStart: '2023-01-01',
                    issuanceDateEnd: '2023-12-31'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const errorMessage = 'Internal server error';
            documentService.getDocuments.mockRejectedValue(new Error(errorMessage));

            await documentsList(mockReq, mockRes);

            expect(documentService.getDocuments).toHaveBeenCalledWith(
                'doc1',
                'Test Document',
                "1",
                "10",
                'title,asc',
                ['Type1', 'Type2'],
                ['Stakeholder1', 'Stakeholder2'],
                '2023-01-01',
                '2023-12-31'
            );

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: errorMessage
            });
        });
        test('should handle multiple documentTypes and stakeholders', async () => {
            const mockReq = {
                query: {
                    documentId: 'doc1',
                    title: 'Test Document',
                    page: '1',
                    size: '10',
                    sort: 'title,asc',
                    documentTypes: 'Type1,Type2',
                    stakeholders: 'Stakeholder1,Stakeholder2',
                    issuanceDateStart: '2023-01-01',
                    issuanceDateEnd: '2023-12-31'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockResult = {
                documents: [
                    { id: 'doc1', title: 'Document 1' },
                    { id: 'doc2', title: 'Document 2' }
                ],
                total: 2,
                page: 1,
                size: 10
            };

            documentService.getDocuments.mockResolvedValue(mockResult);

            await documentsList(mockReq, mockRes);

            expect(documentService.getDocuments).toHaveBeenCalledWith(
                'doc1',
                'Test Document',
                "1",
                "10",
                'title,asc',
                ['Type1', 'Type2'],
                ['Stakeholder1', 'Stakeholder2'],
                '2023-01-01',
                '2023-12-31'
            );

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                ...mockResult
            });
        });
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

            expect(documentService.getDocuments).toHaveBeenCalledWith(
                undefined, // documentId
                undefined, // title
                "1", // page
                "10", // size
                undefined, // sort
                null, // documentTypes
                null, // stakeholders
                undefined, // issuanceDateStart
                undefined // issuanceDateEnd
            );
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
        describe('updateDocument', () => {
            test("successful document update", async () => {
                const mockDocument = {
                    id: '1',
                    title: 'Updated Document',
                    description: 'Updated Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: DocumentType.DESIGN_DOCUMENT,
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: [],
                    connectionIds: []
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
                expect(documentService.putDocument).toHaveBeenCalledWith(
                    '1',
                    mockDocument.title,
                    mockDocument.description,
                    mockDocument.stakeholders,
                    mockDocument.scale,
                    mockDocument.issuanceDate,
                    mockDocument.type,
                    mockDocument.language,
                    mockDocument.coordinates,
                    mockDocument.area,
                    mockDocument.connectionIds
                );
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockDocument
                });
            });
        });
    
        test("document update fails - document not found", async () => {
            jest.spyOn(documentService, 'getDocument').mockResolvedValue(null);

            const mockReq = {
                params: { documentId: '999' },
                body: {
                    title: 'Updated Document',
                    description: 'Updated Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: DocumentType.DESIGN_DOCUMENT,
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: [],
                    connectionIds: []
                }
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


        test('should return 400 if document update fails', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                body: {
                    title: 'Updated Document',
                    description: 'Updated Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: ['Area1'],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            documentService.getDocument.mockResolvedValue(true); // Ensure the document exists
            documentService.putDocument.mockResolvedValue(null); // Simulate update failure

            await updateDocument(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('doc1');
            expect(documentService.putDocument).toHaveBeenCalledWith(
                'doc1',
                'Updated Document',
                'Updated Description',
                ['Stakeholder1'],
                'Large',
                '2023-01-01',
                'Type1',
                'English',
                { lat: 1.1, lng: 2.2 },
                ['Area1'],
                []
            );
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Bad request'
            });
        });
        test('should return 400 if neither area nor coordinates are provided', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                body: {
                    title: 'Updated Document',
                    description: 'Updated Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: {},
                    area: [],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateDocument(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Either area or coordinates must be provided'
            });
        });

        test('should return 500 when an internal server error occurs', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                body: {
                    title: 'Updated Document',
                    description: 'Updated Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 },
                    area: ['Area1'],
                    connectionIds: []
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const errorMessage = 'Internal server error';
            documentService.getDocument.mockRejectedValue(new Error(errorMessage));

            await updateDocument(mockReq, mockRes);

            expect(documentService.getDocument).toHaveBeenCalledWith('doc1');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: errorMessage
            });
        });

    });

    describe('createDocumentType', () => {
        test('should return 400 if document type already exists', async () => {
            const mockReq = {
                body: { name: 'ExistingType' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            documentService.getDocumentTypes.mockResolvedValue(['ExistingType', 'AnotherType']);

            await createDocumentType(mockReq, mockRes);

            expect(documentService.getDocumentTypes).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Document type already exists'
            });
        });

        test('should return 200 if document type is created successfully', async () => {
            const mockReq = {
                body: { name: 'NewType' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            documentService.getDocumentTypes.mockResolvedValue(['ExistingType', 'AnotherType']);
            documentService.postDocumentType.mockResolvedValue();

            await createDocumentType(mockReq, mockRes);

            expect(documentService.getDocumentTypes).toHaveBeenCalled();
            expect(documentService.postDocumentType).toHaveBeenCalledWith('NewType');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalled();
        });
    });
    // Additional List Endpoint Tests
    describe('List Endpoints', () => {
        test("documentTypesList returns all document types", async () => {
            const mockDocumentTypes = ['Type1', 'Type2'];

            // Mock the service method to return the expected data
            jest.spyOn(documentService, 'getDocumentTypes').mockResolvedValue(mockDocumentTypes);

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getDocumentTypesList(null, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockDocumentTypes
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

        test("successful retrieval of stakeholders", async () => {
            const mockStakeholders = ['Stakeholder1', 'Stakeholder2'];
    
            // Mock the getStakeholders service method
            jest.spyOn(documentService, 'getStakeholders').mockResolvedValue(mockStakeholders);
    
            // Mock response object
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the controller method
            await getStakeholdersList(null, mockRes);
    
            // Assertions
            expect(documentService.getStakeholders).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockStakeholders
            });
        });

        
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        test("createDocument handles service error", async () => {
            jest.spyOn(documentService, 'postDocument').mockRejectedValue(new Error('Service Error'));

            const mockReq = {
                body: {
                    title: 'Test Document',
                    description: 'Test Description',
                    stakeholders: ['Stakeholder1'],
                    scale: 'Large',
                    issuanceDate: '2023-01-01',
                    type: DocumentType.DESIGN_DOCUMENT,
                    language: 'English',
                    coordinates: { lat: 1.1, lng: 2.2 }, // Assicurati che i dati passino la validazione
                    area: [], // Assicurati che i dati passino la validazione
                    connectionIds: []
                }
            };
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

    describe('createStakeholder', () => {
        test('should return 400 if stakeholder already exists', async () => {
            const mockReq = {
                body: { name: 'ExistingStakeholder' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            documentService.getStakeholders.mockResolvedValue(['ExistingStakeholder', 'AnotherStakeholder']);

            await createStakeholder(mockReq, mockRes);

            expect(documentService.getStakeholders).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Stakeholder already exists'
            });
        });

        test('should return 200 if stakeholder is created successfully', async () => {
            const mockReq = {
                body: { name: 'NewStakeholder' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            documentService.getStakeholders.mockResolvedValue(['ExistingStakeholder', 'AnotherStakeholder']);
            documentService.postStakeholder.mockResolvedValue();

            await createStakeholder(mockReq, mockRes);

            expect(documentService.getStakeholders).toHaveBeenCalled();
            expect(documentService.postStakeholder).toHaveBeenCalledWith('NewStakeholder');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalled();
        });
    });

    describe('createScale', () => {
        test('should return 400 if scale already exists', async () => {
            const mockReq = {
                body: { name: 'ExistingScale' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            documentService.getScales.mockResolvedValue(['ExistingScale', 'AnotherScale']);

            await createScale(mockReq, mockRes);

            expect(documentService.getScales).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Scale already exists'
            });
        });

        test('should return 200 if scale is created successfully', async () => {
            const mockReq = {
                body: { name: 'NewScale' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            documentService.getScales.mockResolvedValue(['ExistingScale', 'AnotherScale']);
            documentService.postScale.mockResolvedValue();

            await createScale(mockReq, mockRes);

            expect(documentService.getScales).toHaveBeenCalled();
            expect(documentService.postScale).toHaveBeenCalledWith('NewScale');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalled();
        });
    });

    describe('getScalesList', () => {
        test('should return 200 with list of scales', async () => {
            const mockReq = {};
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockScales = ['Scale1', 'Scale2'];
            documentService.getScales.mockResolvedValue(mockScales);

            await getScalesList(mockReq, mockRes);

            expect(documentService.getScales).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockScales
            });
        });
    });

    describe('uploadFile', () => {
        test('should return 500 when an internal server error occurs', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                file: { filename: 'testfile.txt', path: '/tmp/testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const errorMessage = 'Internal server error';
            fs.mkdirSync.mockImplementation(() => { throw new Error(errorMessage); });

            await uploadFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: errorMessage
            });
        });
        test('should return 400 if documentId is not provided', async () => {
            const mockReq = {
                params: {},
                file: { filename: 'testfile.txt', path: '/tmp/testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await uploadFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document ID is required'
            });
        });

        test('should return 400 if file is not provided', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                file: null
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await uploadFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'File is required'
            });
        });

        test('should return 200 if file is uploaded successfully', async () => {
            const mockReq = {
                params: { documentId: 'doc1' },
                file: { filename: 'testfile.txt', path: '/tmp/testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            fs.mkdirSync.mockImplementation(() => {});
            fs.renameSync.mockImplementation(() => {});

            await uploadFile(mockReq, mockRes);

            expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
            expect(fs.renameSync).toHaveBeenCalledWith('/tmp/testfile.txt', expect.any(String));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'File uploaded successfully',
                documentId: 'doc1',
                file: expect.any(String)
            });
        });
    });

    describe('downloadFile', () => {
        test('should return 400 if documentId or fileName is not provided', async () => {
            const mockReq = {
                params: { documentId: '', fileName: '' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await downloadFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document ID and file name are required'
            });
        });

        test('should return 404 if file is not found', async () => {
            const mockReq = {
                params: { documentId: 'doc1', fileName: 'testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            fs.existsSync.mockReturnValue(false);

            await downloadFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'File not found'
            });
        });

        test('should return 200 and download the file if found', async () => {
            const mockReq = {
                params: { documentId: 'doc1', fileName: 'testfile.txt' }
            };
            const mockRes = {
                download: jest.fn()
            };

            fs.existsSync.mockReturnValue(true);

            await downloadFile(mockReq, mockRes);

            expect(mockRes.download).toHaveBeenCalledWith(expect.any(String), 'testfile.txt');
        });
    });

    describe('deleteFile', () => {
        test('should return 400 if documentId or fileName is not provided', async () => {
            const mockReq = {
                params: { documentId: '', fileName: '' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await deleteFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document ID and file name are required'
            });
        });

        test('should return 404 if file is not found', async () => {
            const mockReq = {
                params: { documentId: 'doc1', fileName: 'testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            fs.existsSync.mockReturnValue(false);

            await deleteFile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'File not found'
            });
        });

        test('should return 200 if file is deleted successfully', async () => {
            const mockReq = {
                params: { documentId: 'doc1', fileName: 'testfile.txt' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            fs.existsSync.mockReturnValue(true);
            fs.unlinkSync.mockImplementation(() => {});

            await deleteFile(mockReq, mockRes);

            expect(fs.existsSync).toHaveBeenCalledWith(expect.any(String));
            expect(fs.unlinkSync).toHaveBeenCalledWith(expect.any(String));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'File deleted successfully'
            });
        });
    });





});