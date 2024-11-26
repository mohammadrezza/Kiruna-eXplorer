import express from "express";
import multer from 'multer';
import {body, param} from "express-validator";
import moment from "moment";
import storage from "../middlewares/storage.mjs";
import Auth from "../auth/auth.mjs";
import {validator} from "../middlewares/validator.mjs";
import {
    createDocument,
    documentsList,
    documentConnectionTypesList,
    getDocumentWithId,
    updateDocument,
    getStakeholdersList,
    createDocumentType,
    createStakeholder,
    createScale,
    getScalesList,
    getDocumentTypesList,
    uploadDocument
} from "../controllers/documentController.mjs";

class DocumentRouter {
    constructor(app) {
        this.app = app;
        this.auth = new Auth(app);
        this.router = express.Router()
        this.upload = multer({ storage: storage });
        this.initRoutes()
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {
        this.router.post("/",
            body('title').isString().notEmpty().withMessage('Title is required'),
            body('description').isString().notEmpty().withMessage('Description is required'),
            body('stakeholders').isArray().withMessage('Stakeholders must be an array'),
            body('stakeholders.*').isString().notEmpty().withMessage('Each stakeholder must be a non-empty string'),
            body('scale').isString().notEmpty().withMessage('Scale is required'),
            body('issuanceDate').custom(value => {
                if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
                    throw new Error('Issuance Date must be a valid date in the format DD-MM-YYYY');
                }
                return true;
            }),
            body('type').isString().notEmpty().withMessage('Type is required'),
            body('language').isString().notEmpty().withMessage('Language is required'),
            body('coordinates').isObject().withMessage('Coordinates must be an object'),
            body('coordinates.lat').isFloat().withMessage('Latitude must be a float'),
            body('coordinates.lng').isFloat().withMessage('Longitude must be a float'),
            body('connectionIds').isArray().withMessage('Connection IDs must be an array'),
            body('connectionIds.*.id').isString().notEmpty().withMessage('Each connection ID must be a non-empty string'),
            body('connectionIds.*.type').isString().notEmpty().withMessage('Each connection type must be a non-empty string'),
            validator,
            this.auth.isLoggedIn,
            this.auth.isUrbanPlanner,
            createDocument);
        this.router.put("/:documentId",
            param('documentId').isString().notEmpty().withMessage('Document ID is required'),
            body('title').optional().isString().withMessage('Title must be a string'),
            body('description').optional().isString().withMessage('Description must be a string'),
            body('stakeholders').optional().isArray().withMessage('Stakeholders must be an array'),
            body('stakeholders.*').optional().isString().notEmpty().withMessage('Each stakeholder must be a non-empty string'),
            body('scale').optional().isString().withMessage('Scale must be a string'),
            body('issuanceDate').custom(value => {
                if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
                    throw new Error('Issuance Date must be a valid date in the format DD-MM-YYYY');
                }
                return true;
            }),
            body('type').optional().isString().withMessage('Type must be a string'),
            body('language').optional().isString().withMessage('Language must be a string'),
            body('coordinates').optional().isObject().withMessage('Coordinates must be an object'),
            body('coordinates.lat').optional().isFloat().withMessage('Latitude must be a float'),
            body('coordinates.lng').optional().isFloat().withMessage('Longitude must be a float'),
            body('connectionIds').optional().isArray().withMessage('Connection IDs must be an array'),
            body('connectionIds.*.id').optional().isString().notEmpty().withMessage('Each connection ID must be a non-empty string'),
            body('connectionIds.*.type').optional().isString().notEmpty().withMessage('Each connection type must be a non-empty string'),
            validator,
            this.auth.isLoggedIn,
            this.auth.isUrbanPlanner,
            updateDocument);
        this.router.post('/types', createDocumentType);
        this.router.get("/types", getDocumentTypesList);
        this.router.post("/stakeholders", createStakeholder);
        this.router.get("/stakeholders", getStakeholdersList);
        this.router.post("/scales", createScale);
        this.router.get("/scales", getScalesList);
        this.router.get("/connectionTypes", documentConnectionTypesList);
        this.router.get('/:id', getDocumentWithId);
        this.router.get("/", documentsList);
        this.router.post("/:documentId/files",
            this.upload.single('file'),
            uploadDocument);
    }
}
export default DocumentRouter;
