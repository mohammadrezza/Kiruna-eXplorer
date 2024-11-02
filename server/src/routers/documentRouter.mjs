import express from "express";
import {createDocument, documentTypesList} from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types/", documentTypesList);


export default documentRouter;
