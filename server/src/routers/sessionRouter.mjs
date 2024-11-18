import express from "express";
import {login, getCurrentSession} from "../Controllers/sessionController.mjs";
import { body, validationResult } from "express-validator";

const sessionRouter = express.Router();

// Middleware login validation
const validateLogin = [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

sessionRouter.post("/", validateLogin, login);
sessionRouter.get("/", getCurrentSession);

export default sessionRouter;
