import passport from "passport";
import {IncorrectCredentialsError, UnauthorizedError} from "../errors/userErrors.mjs";

async function login(req, res, next) {
    const authMiddleware = passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return next(new IncorrectCredentialsError())
        }
        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.status(200).json({
                "user": {
                    "username": user.username,
                    "role": user.role
                }
            });
        })
    });
    await authMiddleware(req, res, next)
}

async function getCurrentSession(req, res, next) {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            "user": {
                "username": req.user.username,
                "role": req.user.role
            }
        });
    }
    return next(new UnauthorizedError())
}

export {
    login,
    getCurrentSession
}