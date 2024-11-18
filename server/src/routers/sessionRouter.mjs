import express from "express";
import {login, getCurrentSession} from "../Controllers/sessionController.mjs";
import {validator} from "../middlewares/validator.mjs";
import {body} from "express-validator";

const sessionRouter = express.Router();

sessionRouter.post("/",
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty(),
    validator,
    login);
sessionRouter.get("/", getCurrentSession);

export default sessionRouter;
