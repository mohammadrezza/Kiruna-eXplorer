import express from "express";
import {createDocument, documentTypesList, getDocumentWithId} from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get('/:id', getDocumentWithId);

export default documentRouter;
