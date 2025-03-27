"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserfilesModel = exports.FilesModel = exports.AdminModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const config_1 = require("./config");
mongoose_1.default.connect(config_1.MONGO_URL);
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    PhNo: { type: String },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    googleId: { type: String }
});
const adminSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const filesSchema = new mongoose_1.Schema({
    userId: { type: ObjectId, required: true },
    files: [
        {
            filename: { type: String, required: true },
            documentUrl: { type: String, required: true },
            colorMode: { type: String, enum: ["black_white", "color"], required: true },
            side: { type: String, enum: ["single", "double"], required: true },
            papersize: { type: String, enum: ["1", "2", "4"], required: true },
            numberofcopies: { type: Number, required: true },
            numberofpages: { type: Number, required: true },
            price: { type: Number, require: true },
        }
    ],
    TotalAmount: { type: Number, required: true },
    TotalSheets: { type: Number, required: true }
});
const UserfilesSchema = new mongoose_1.Schema({
    userId: { type: ObjectId, required: true },
    files: [
        {
            filename: { type: String, required: true },
            documentUrl: { type: String, required: true },
            colorMode: { type: String, enum: ["black_white", "color"], required: true },
            side: { type: String, enum: ["single", "double"], required: true },
            papersize: { type: String, enum: ["1", "2", "4"], required: true },
            numberofcopies: { type: Number, required: true },
            numberofpages: { type: Number, required: true },
            price: { type: Number, require: true },
        }
    ]
});
exports.UserModel = (0, mongoose_1.model)("userSchema", userSchema);
exports.AdminModel = (0, mongoose_1.model)("adminSchema", adminSchema);
exports.FilesModel = (0, mongoose_1.model)("filesSchema", filesSchema);
exports.UserfilesModel = (0, mongoose_1.model)("particularuserSchema", UserfilesSchema);
