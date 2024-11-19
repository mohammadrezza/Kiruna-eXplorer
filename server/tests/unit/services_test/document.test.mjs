import {describe} from "@jest/globals";
import DocumentConnectionType from "../../../src/components/documentConnectionType.mjs";
import DocumentType from "../../../src/components/documentType.mjs";

const documentService = require('../../../src/services/documentService.mjs');
import * as documentDao from '../../../src/daos/documentDAO.mjs';
import {deleteAllConnections} from "../../../src/daos/documentDAO.mjs";

jest.mock('../../../src/daos/documentDao.mjs');
afterEach(() => {
    jest.clearAllMocks()
})
describe('Services', () => {

    describe('put document', () => {
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
})