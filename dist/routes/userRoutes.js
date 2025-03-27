"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const passport_1 = __importDefault(require("passport"));
require("../controllers/googleauth");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", userController_1.createUser);
userRouter.post("/signin", userController_1.loginUser);
userRouter.post("/forgotpassword", userController_1.forgotPassword);
userRouter.post("/resetpassword", userController_1.resetPassword);
userRouter.post("/updatepassword", userController_1.updatePassword);
userRouter.get('/auth/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
userRouter.get("/auth/google/callback", passport_1.default.authenticate('google', {
    successRedirect: '/api/v1/users/protected',
    failureRedirect: '/api/v1/users/auth/google/failure'
}));
userRouter.get("/auth/google/failure", (req, res) => {
    res.send("failed to authenticate");
});
//@ts-ignore
userRouter.get("/protected", isLoggedIn, (req, res) => {
    res.send("hello world");
});
//@ts-ignore
userRouter.get("/me", userMiddleware_1.usermiddleware, (req, res) => {
    console.log(req.user);
    res.send("protected routes");
});
function isLoggedIn(req, res, next) {
    //@ts-ignore
    req.user ? next() : res.status(500).json({
        message: "You cannot access here"
    });
}
userRouter.get("/logout", (req, res, next) => {
    if (req.logout) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                res.send("good bye");
            });
        });
    }
    else {
        res.status(400).json({
            message: "No active sesssion found"
        });
    }
});
exports.default = userRouter;
