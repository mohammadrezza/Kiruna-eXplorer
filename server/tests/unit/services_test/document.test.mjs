import {describe} from "@jest/globals";
import DocumentConnectionType from "../../../src/components/documentConnectionType.mjs";
import DocumentType from "../../../src/components/documentType.mjs";

const documentService = require('../../../src/services/documentService.mjs');
import * as documentDao from '../../../src/daos/documentDAO.mjs';
import {getDocumentWithConnections, getDocumentStakeholders} from "../../../src/daos/documentDAO.mjs";

jest.mock('../../../src/daos/documentDao.mjs');
afterEach(() => {
    jest.clearAllMocks()
})
describe('Services', () => {

    describe('getDocuments', () => {
        test('should call getAllDocuments with correct parameters and return the result', async () => {
            const documentId = '123';
            const title = 'Test Document';
            const page = 1;
            const size = 10;
            const sort = 'title';
            const documentTypes = []
            const stakeholders = []
            const issuanceDateStart = '01-01-2023'
            const issuanceDateEnd = '01-01-2024'

            const mockResult = {
                data: [
                    {id: '1', title: 'Document 1'},
                    {id: '2', title: 'Document 2'}
                ],
                pagination: {
                    total: 2,
                    totalPages: 1,
                    currentPage: 1,
                    size: 10,
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            };

            documentDao.getAllDocuments.mockResolvedValue(mockResult);

            const result = await documentService.getDocuments(documentId, title, page, size, sort, documentTypes, stakeholders, issuanceDateStart, issuanceDateEnd);

            expect(documentDao.getAllDocuments).toHaveBeenCalledWith(documentId, title, page, size, sort, documentTypes, stakeholders, issuanceDateStart, issuanceDateEnd);
            expect(result).toEqual(mockResult);
        });
    });

    describe('post document', () => {
        test('should handle error when creating the document', async () => {
            const document = {
                title: 'title',
                description: 'description',
                stakeholders: ['stakeholder'],
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '{"lat": 1.1, "lng": 2.2}',
                area: [],
                connections: [{id: 'id', type: DocumentConnectionType.PROJECTION}]
            };

            const errorMessage = 'Error creating the document';
            jest.spyOn(documentDao, 'addDocument').mockRejectedValue(new Error(errorMessage));

            await expect(documentService.postDocument(
                document.title,
                document.description,
                document.stakeholders,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).rejects.toThrow(`Error creating document: ${errorMessage}`);

            expect(documentDao.addDocument).toHaveBeenCalledWith(
                expect.any(String),
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections.length
            );
        });

        test('create document with all fields', async () => {
            const document = {
                title: 'title',
                description: 'description',
                stakeholders: ['stakeholder'],
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '{"lat": 1.1, "lng": 2.2}',
                area: [],
                connections: [{id: 'id', type: DocumentConnectionType.PROJECTION}]
            }
            jest.spyOn(documentDao, 'addDocument').mockResolvedValue();
            jest.spyOn(documentDao, 'addDocumentStakeholder').mockResolvedValue();
            jest.spyOn(documentDao, 'addDocumentConnection').mockResolvedValue();

            const result = await documentService.postDocument(
                document.title,
                document.description,
                document.stakeholders,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )

            expect(result.data.title).toStrictEqual(document.title);
            expect(result.data.description).toStrictEqual(document.description);
            expect(result.data.stakeholders).toStrictEqual(document.stakeholders);
            expect(result.data.scale).toStrictEqual(document.scale);
            expect(result.data.issuanceDate).toStrictEqual(document.issuanceDate);
            expect(result.data.type).toStrictEqual(document.type);
            expect(result.data.language).toStrictEqual(document.language);
            expect(result.data.coordinates).toStrictEqual(document.coordinates);
        });
    })

    describe('put document', () => {

        test('update document with all fields', async () => {
            const document = {
                id: 'id',
                title: 'title',
                description: 'description',
                stakeholders: ['stakeholder'],
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '{"lat": 1.1, "lng": 2.2}',
                area: [],
                connections: [{id: 'id', type: DocumentConnectionType.PROJECTION}]
            }
            jest.spyOn(documentDao, 'editDocument').mockResolvedValue();
            jest.spyOn(documentDao, 'deleteAllStakeholders').mockResolvedValue();
            jest.spyOn(documentDao, 'deleteAllConnections').mockResolvedValue();
            jest.spyOn(documentDao, 'addDocumentStakeholder').mockResolvedValue();
            jest.spyOn(documentDao, 'editDocumentConnection').mockResolvedValue();

            const result = await documentService.putDocument(
                document.id,
                document.title,
                document.description,
                document.stakeholders,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )

            expect(result.data.title).toStrictEqual(document.title);
            expect(result.data.description).toStrictEqual(document.description);
            expect(result.data.stakeholders).toStrictEqual(document.stakeholders);
            expect(result.data.scale).toStrictEqual(document.scale);
            expect(result.data.issuanceDate).toStrictEqual(document.issuanceDate);
            expect(result.data.type).toStrictEqual(document.type);
            expect(result.data.language).toStrictEqual(document.language);
            expect(result.data.coordinates).toStrictEqual(document.coordinates);
        });
        test('should handle error when updating the document', async () => {
            const document = {
                id: 'id',
                title: 'title',
                description: 'description',
                stakeholders: ['stakeholder'],
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '{"lat": 1.1, "lng": 2.2}',
                connections: [{id: 'id', type: DocumentConnectionType.PROJECTION}]
            };

            const errorMessage = 'Error updating the document';
            jest.spyOn(documentDao, 'editDocument').mockRejectedValue(new Error(errorMessage));

            await expect(documentService.putDocument(
                document.id,
                document.title,
                document.description,
                document.stakeholders,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).rejects.toThrow(`Error updating document: ${errorMessage}`);

            expect(documentDao.editDocument).toHaveBeenCalledWith(
                document.id,
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections.length
            );
        });


    })

    describe('getDocument', () => {

        test('should return a document with connections', async () => {
            const documentId = '123';

            const mockDocumentData = [
                {
                    doc_id: '123',
                    doc_title: 'Main Document',
                    doc_description: 'Description of main document',
                    doc_scale: '1:500',
                    doc_issuanceDate: '2023-01-01',
                    doc_type: 'Type1',
                    doc_language: 'English',
                    doc_coordinates: '{"lat": 1.1, "lng": 2.2}',
                    conn_id: '456',
                    conn_title: 'Connected Document',
                    conn_description: 'Description of connected document',
                    conn_scale: '1:1000',
                    conn_issuanceDate: '2023-02-01',
                    conn_type: 'Type2',
                    conn_language: 'French',
                    conn_coordinates: '{"lat": 3.3, "lng": 4.4}'
                }
            ];

            const mockStakeholders = [
                {stakeholder: 'Stakeholder1'},
                {stakeholder: 'Stakeholder2'}
            ];

            const mockConnStakeholders = [
                {stakeholder: 'ConnStakeholder1'},
                {stakeholder: 'ConnStakeholder2'}
            ];

            getDocumentWithConnections.mockResolvedValue(mockDocumentData);
            getDocumentStakeholders.mockResolvedValueOnce(mockStakeholders).mockResolvedValueOnce(mockConnStakeholders);

            const result = await documentService.getDocument(documentId);

            expect(getDocumentWithConnections).toHaveBeenCalledWith(documentId);
            expect(getDocumentStakeholders).toHaveBeenCalledWith(documentId);
            expect(getDocumentStakeholders).toHaveBeenCalledWith('456');

        });

        test('should handle error when fetching the document', async () => {
            const documentId = '123';
            const errorMessage = 'Error fetching document';

            getDocumentWithConnections.mockRejectedValue(new Error(errorMessage));

            await expect(documentService.getDocument(documentId)).rejects.toThrow(`Error fetching document: ${errorMessage}`);

            expect(getDocumentWithConnections).toHaveBeenCalledWith(documentId);
            expect(getDocumentStakeholders).not.toHaveBeenCalled();
        });

        test('should return null if documentData is empty', async () => {
            const documentId = '123';

            getDocumentWithConnections.mockResolvedValue([]);
            getDocumentStakeholders.mockResolvedValue([]);

            const result = await documentService.getDocument(documentId);

            expect(getDocumentWithConnections).toHaveBeenCalledWith(documentId);
            expect(getDocumentStakeholders).toHaveBeenCalledWith(documentId);
            expect(result).toBeNull();
        });


    });
})