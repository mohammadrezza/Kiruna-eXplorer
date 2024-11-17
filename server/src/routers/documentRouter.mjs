import express from "express";
import {
    createDocument,
    documentsList,
    documentTypesList,
    documentConnectionTypesList,
    getDocumentWithId,
    updateDocument,
    getStakeholdersList
} from "../controllers/documentController.mjs";
import Auth from "../auth/auth.mjs";
import auth from "../auth/auth.mjs";

class DocumentRouter {
    constructor(app) {
        this.app = app;
        this.auth = new Auth(app);
        this.router = express.Router()
        this.initRoutes()
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {
        this.router.post("/", this.auth.isLoggedIn, this.auth.isUrbanPlanner, createDocument);
        this.router.get("/types", documentTypesList);
        this.router.get("/connectionTypes", documentConnectionTypesList);
        this.router.get("/stakeholders", getStakeholdersList);
        this.router.get('/:id', getDocumentWithId);
        this.router.get("/", documentsList);
        this.router.put("/:documentId", this.auth.isLoggedIn, this.auth.isUrbanPlanner, updateDocument);
    }

}

export default DocumentRouter;
