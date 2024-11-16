import express from "express";
import multer from 'multer';
import path from 'path';

import {
  createDocument,
  documentsList,
  documentTypesList,
  documentConnectionTypesList,
  getDocumentWithId,
  updateDocument,
  getStakeholdersList,
  uploadDocument
} from "../controllers/documentController.mjs";


const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'uploads'), 
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const documentRouter = express.Router();

documentRouter.post("/", createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get("/connectionTypes", documentConnectionTypesList);
documentRouter.get("/stakeholders", getStakeholdersList);
documentRouter.get('/:id', getDocumentWithId);
documentRouter.get("/", documentsList);
documentRouter.put("/:documentId", updateDocument);
documentRouter.post("/:documentId/upload",upload.single('file'), uploadDocument);

export default documentRouter;
