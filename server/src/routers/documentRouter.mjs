import express from "express";
import { createDocument } from "../controllers/documentController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", createDocument);

export default documentRouter;
