import express from "express";
import {body, param} from "express-validator";
import moment from "moment";
import {
    createDocument,
    documentsList,
    documentTypesList,
    documentConnectionTypesList,
    getDocumentWithId,
    updateDocument,
    getStakeholdersList
} from "../controllers/documentController.mjs";
import {validator} from "../middlewares/validator.mjs";

const documentRouter = express.Router();


documentRouter.post("/",
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
    createDocument);
documentRouter.get("/types", documentTypesList);
documentRouter.get("/connectionTypes", documentConnectionTypesList);
documentRouter.get("/stakeholders", getStakeholdersList);
documentRouter.get('/:id', getDocumentWithId);
documentRouter.get("/", documentsList);
documentRouter.put("/:documentId",
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
    updateDocument
);

export default documentRouter;
