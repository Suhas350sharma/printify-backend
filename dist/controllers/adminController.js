"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = createAdmin;
exports.loginAdmin = loginAdmin;
const userValidation_1 = require("../validations/userValidation");
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parseData = userValidation_1.Validation.safeParse(req.body);
            console.log(parseData);
            if (!parseData.success) {
                res.status(400).json({ error: parseData.error });
                return;
            }
            const { username, PhNo, email, password } = req.body;
            const checkuserExist = yield db_1.AdminModel.findOne({ email: email });
            console.log(checkuserExist);
            if (checkuserExist) {
                res.status(400).json({ message: "This email  was already registered" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newuser = yield db_1.AdminModel.create({
                username: username,
                PhNo: PhNo,
                email: email,
                password: hashedPassword
            });
            console.log(newuser);
            res.status(201).json({ message: "User created successfully", newuser });
            return;
        }
        catch (err) {
            res.status(500).json({ errorr: "Internal Server Error", error: err });
            return;
        }
    });
}
function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const checkAdminexist = yield db_1.AdminModel.findOne({ email: email });
            console.log(checkAdminexist);
            if (!checkAdminexist) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, checkAdminexist.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid Credentials" });
                return;
            }
            //@ts-ignore
            const token = jsonwebtoken_1.default.sign({ id: checkAdminexist._id }, config_1.JWT_ADMIN_SECRET);
            res.status(200).json({
                message: "login success",
                token: token
            });
            return;
        }
        catch (err) {
            console.log("Error in loginAdmin:", err);
            res.status(500).json({
                errorr: "Internal Server Error",
                error: err
            });
            return;
        }
    });
}
