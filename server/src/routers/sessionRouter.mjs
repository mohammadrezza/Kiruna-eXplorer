import express from "express";
import {login, getCurrentSession} from "../controllers/sessionController.mjs";
import {validator} from "../middlewares/validator.mjs";
import {body} from "express-validator";
import Auth from "../auth/auth.mjs";

class SessionRouter {
    constructor(app) {
        this.app = app;
        this.auth = new Auth(app);
        this.router = express.Router()
        this.initRoutes()
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {
        this.router.post("/",
            body('username').isString().notEmpty(),
            body('password').isString().notEmpty(),
            validator,
            login);
        this.router.get("/", getCurrentSession);
    }
}

export default SessionRouter;
