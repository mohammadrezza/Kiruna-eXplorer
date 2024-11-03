import express from "express";
import {createDocument, documentTypesList, getDocument} from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get('/:id', getDocument);

export default documentRouter;
