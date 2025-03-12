"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLBACKURL = exports.CLIENT_SECRET = exports.CLIENT_ID = exports.JWT_ADMIN_SECRET = exports.JWT_USER_SECRET = exports.MONGO_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("JWT_USER_SECRET:", process.env.JWT_USER_SECRET);
exports.MONGO_URL = process.env.MONGO_URL;
exports.JWT_USER_SECRET = process.env.JWT_USER_SECRET;
exports.JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.CLIENT_SECRET = process.env.CLIENT_SECRET;
exports.CALLBACKURL = process.env.CALLBACKURL;
