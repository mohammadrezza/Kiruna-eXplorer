import {createDocument, documentsList} from '../../../controllers/documentController.mjs'
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
})


