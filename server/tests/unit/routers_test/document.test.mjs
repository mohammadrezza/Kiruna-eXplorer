import {test, expect, jest} from "@jest/globals"
import request from 'supertest'
import Authenticator from "../../../src/auth/auth.mjs";
import {app} from "../../../index.mjs"
import * as documentController from "../../../src/controllers/documentController.mjs";
import * as middlewares from "../../../src/middlewares/validator.mjs";
import * as initDB from "../../../src/db/initializeDatabase.mjs";
import DocumentType from "../../../src/components/documentType.mjs";
import DocumentConnectionType from "../../../src/components/documentConnectionType.mjs";

jest.mock("../../../src/controllers/documentController.mjs")
jest.mock("../../../src/auth/auth.mjs")
jest.mock("../../../src/db/initializeDatabase.mjs")


afterEach(() => {
    jest.clearAllMocks()
})

const urbanPlanner = {
    username: "urban_planner",
    password: "708090"
}
const document = {
    title: 'title',
    description: 'description',
    stakeholders: ['stakeholder'],
    scale: 'scale',
    issuanceDate: '01-01-2025',
    type: DocumentType.DESIGN_DOCUMENT,
    language: 'language',
    coordinates: {"lat": 1.1, "lng": 2.2},
    connectionIds: [{id: 'id', type: DocumentConnectionType.PROJECTION}]
};

describe("Document Router", () => {
    test("POST /documents should return 200 - user must be logged in as urban planner", async () => {

        jest.spyOn(initDB, "initializeDatabase").mockResolvedValue({})

        jest.spyOn(middlewares, "validator").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isUrbanPlanner").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(documentController, "createDocument").mockImplementation((req, res, next) => {
            return res.status(201).json({
                success: true,
                data: document
            });
        })

        const response = await request(app).post("/documents/").send({...document})

        expect(response.status).toBe(201)
        expect(documentController.createDocument).toHaveBeenCalledTimes(1)
    })
})