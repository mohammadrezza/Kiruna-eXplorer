import express from "express";
import {createDocument, documentsList, documentTypesList, documentConnectionTypesList, getDocumentWithId, updateDocument} from "../controllers/documentController.mjs";
const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get("/connectionTypes", documentConnectionTypesList);
documentRouter.get('/:id', getDocumentWithId);
documentRouter.get("/", documentsList);
documentRouter.put("/:documentId",
    updateDocument
  );

export default documentRouter;
