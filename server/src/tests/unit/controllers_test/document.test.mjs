import {createDocument, documentsList, updateDocument} from '../../../controllers/documentController.mjs'
import DocumentType from "../../../components/documentType.mjs";
import * as documentService from "../../../services/documentService.mjs";
import {describe} from "@jest/globals";

jest.mock('../../../services/documentService.mjs')

afterEach(() => {
    jest.clearAllMocks()
})

describe('controllers', () => {
    describe('post document', () => {
        test("successful creation of a document with no connections", async () => {
            const document = {
                title: 'title',
                description: 'description',
                stakeholders: 'stakeholders',
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '[1.1, 2.2]',
                connectionIds: []
            }
            jest.spyOn(documentService, 'postDocument').mockResolvedValue(document);
            await createDocument({
                    body: document
                },
                {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                })
            expect(documentService.postDocument).toHaveBeenCalledTimes(1)
        });
    })
    describe('get documents list', () => {
        test("successful retrieval of documents", async () => {
            const documents = [
                {
                    title: 'title',
                    description: 'description',
                    stakeholders: 'stakeholders',
                    scale: 'scale',
                    issuanceDate: 'issuanceDate',
                    type: DocumentType.DESIGN_DOCUMENT,
                    language: 'language',
                    coordinates: '[1.1, 2.2]',
                    connectionIds: []
                },
                {
                    title: 'title2',
                    description: 'description2',
                    stakeholders: 'stakeholders2',
                    scale: 'scale2',
                    issuanceDate: 'issuanceDate',
                    type: DocumentType.DESIGN_DOCUMENT,
                    language: 'language',
                    coordinates: '[3.3, 4.4]',
                    connectionIds: []
                }
            ]
            jest.spyOn(documentService, 'getDocuments').mockResolvedValue(documents);
            await documentsList({
                    query: {}
                },
                {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                })
            expect(documentService.getDocuments).toHaveBeenCalledTimes(1)
        })
    })
    
    describe('update document', () => {

        test("successful update of a document", async () => {
            const document = {
                id: '1',
                title: 'updated title',
                description: 'updated description',
                stakeholders: 'updated stakeholders',
                scale: 'updated scale',
                issuanceDate: 'updated issuanceDate',
                type: 'DESIGN_DOCUMENT',
                language: 'updated language',
                coordinates: '[1.1, 2.2]',
                connectionIds: []
            };
    
            
            jest.spyOn(documentService, 'getDocument').mockResolvedValue(document);
    
           
            jest.spyOn(documentService, 'putDocument').mockResolvedValue(document);
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await updateDocument(
                { params: { documentId: '1' }, body: document },
                res
            );
    
           
            expect(documentService.getDocument).toHaveBeenCalledTimes(1);
            expect(documentService.putDocument).toHaveBeenCalledTimes(1);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: document
            });
        });
    
        test("failed update of a document due to non-existent document", async () => {
            const document = {
                id: '1',
                title: 'updated title',
                description: 'updated description',
                stakeholders: 'updated stakeholders',
                scale: 'updated scale',
                issuanceDate: 'updated issuanceDate',
                type: 'DESIGN_DOCUMENT',
                language: 'updated language',
                coordinates: '[1.1, 2.2]',
                connectionIds: []
            };
    
           
            jest.spyOn(documentService, 'getDocument').mockResolvedValue(null);
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await updateDocument(
                { params: { documentId: '1' }, body: document },
                res
            );
    
           
            expect(documentService.getDocument).toHaveBeenCalledTimes(1);
            expect(documentService.putDocument).not.toHaveBeenCalled();
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Document not found'
            });
        });
    });
    
})


