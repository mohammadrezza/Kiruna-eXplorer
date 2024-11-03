import express from "express";
import {createDocument, documentsList, documentTypesList} from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types/", documentTypesList);
documentRouter.get("/", documentsList);


export default documentRouter;
