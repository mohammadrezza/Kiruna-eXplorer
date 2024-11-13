import express from "express";
import {login, getCurrentSession} from "../Controllers/sessionController.mjs";

const documentRouter = express.Router();

documentRouter.post("/", login);
documentRouter.get("/", getCurrentSession);

export default documentRouter;
