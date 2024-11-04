import express from "express";
import {createDocument, documentsList, documentTypesList, getDocumentWithId, updateDocument} from "../controllers/documentController.mjs";
const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get('/:id', getDocumentWithId);
documentRouter.get("/", documentsList);
documentRouter.put("/:documentId",
    updateDocument
  );

export default documentRouter;
