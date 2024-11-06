import {describe} from "@jest/globals";

import DocumentType from "../../../components/documentType.mjs";
import {addDocument} from "../../../daos/documentDAO.mjs";
import Document from "../../../components/document.mjs";
import db from "../../../db/db.mjs";

jest.mock('../../../db/db.mjs')

afterEach(() => {
    jest.clearAllMocks()
})

describe('database queries', () => {

    describe('addDocument', () => {

        test("addDocument query", async () => {
            jest.spyOn(db, "run").mockImplementation((query, params, callback) => {
                callback(null, document)
                return {}
            })
            const document = new Document();
            document.createFromObject({
                title: 'title',
                description: 'description',
                stakeholders: 'stakeholders',
                scale: 'scale',
                issuanceDate: 'issuanceDate',
                type: DocumentType.DESIGN_DOCUMENT,
                language: 'language',
                coordinates: '[1.1, 2.2]',
                connectionIds: []
            })
            const result = await addDocument(
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
            expect(result).toBeUndefined()
        });


    })
})