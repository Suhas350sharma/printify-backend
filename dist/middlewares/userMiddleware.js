"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usermiddleware = usermiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function usermiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "token missing" });
        }
        console.log(authHeader);
        const decode = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_USER_SECRET);
        console.log(decode);
        if (decode) {
            req.user = decode.id;
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
