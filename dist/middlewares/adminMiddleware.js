"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = AdminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function AdminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "token missing" });
        }
        console.log(authHeader);
        const decode = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_ADMIN_SECRET);
        console.log(decode);
        if (decode) {
            req.admin = decode.id;
            next();
        }
        else {
            res.status(400).json({ message: "This page is restricted" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Bad Request", error: error });
    }
}
