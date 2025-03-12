"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
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
    successRedirect: '/protected',
    failureRedirect: '/api/v1/users/auth/google/failure'
}));
userRouter.get("/auth/google/failure", (req, res) => {
    res.send("failed to authenticate");
});
userRouter.get("/protected", (req, res) => {
    res.send("hello world");
});
exports.default = userRouter;
