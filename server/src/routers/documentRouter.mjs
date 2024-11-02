import express from "express";
import { createDocument, updateDocument } from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.put("/:documentId", 
    updateDocument
  );

export default documentRouter;
