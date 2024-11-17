import passport from "passport";
import crypto from "crypto";
import session from "express-session";
import LocalStrategy from "passport-local";
import * as UserDAO from "../daos/userDAO.mjs";
import UserType from "../components/userType.mjs";
import {UnauthorizedError} from "../errors/userErrors.mjs";

class Auth {
    constructor(app) {
        this.app = app;
        this.initAuth()
    }

    static async isAuthenticated(username, password) {
        const user = await UserDAO.getUserByUsername(username);
        if (!user) {
            return false;
        }
        const hashedPassword = crypto.scryptSync(password, user.salt, 16);
        const passwordHex = Buffer.from(user.password, "hex");
        return crypto.timingSafeEqual(passwordHex, hashedPassword);
    }

    initAuth() {
        this.app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: false,
            maxAge: 15 * 60 * 1000,
            cookie: {
                expires: 60 * 60 * 24 * 1000,
                httpOnly: false,
            }
        }))

        this.app.use(passport.initialize())
        this.app.use(passport.session())

        passport.use(
            new LocalStrategy({}, async function verify(username, password, cb) {
                const user = await UserDAO.getUserByUsername(username)
                if (!user) {
                    return cb(null, false, {})
                }
                const isAuth = await Auth.isAuthenticated(username, password)
                if (!isAuth) {
                    return cb(null, false, {})
                }
                return cb(null, user)
            })
        )

        passport.serializeUser(function (user, cb) {
            cb(null, user);
        });

        passport.deserializeUser(function (user, cb) {
            UserDAO.getUserByUsername(user.username)
                .then((user) => {
                    cb(null, user)
                }).catch((err) => {
                cb(null, err)
            })
        });

    }

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        throw new UnauthorizedError()
    }


    isUrbanPlanner(req, res, next) {
        if (req.isAuthenticated() && req.user.role === UserType.URBAN_PLANNER) {
            return next()
        }
        throw new UnauthorizedError()
    }

    isResident(req, res, next) {
        if (req.isAuthenticated() && req.user.role === UserType.RESIDENT) {
            return next()
        }
        throw new UnauthorizedError()

    }

    isVisitor(req, res, next) {
        if (req.isAuthenticated() && req.user.role === UserType.RESIDENT) {
            return next()
        }
        throw new UnauthorizedError()
    }
}

export default Auth;