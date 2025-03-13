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
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.updatePassword = updatePassword;
const userValidation_1 = require("../validations/userValidation");
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parseData = userValidation_1.Validation.safeParse(req.body);
            console.log(parseData);
            if (!parseData.success) {
                res.status(400).json({ error: parseData.error });
                return;
            }
            const { username, PhNo, email, password } = req.body;
            const checkuserExist = yield db_1.UserModel.findOne({ email: email });
            console.log(checkuserExist);
            if (checkuserExist) {
                res.status(400).json({ message: "This email  was already registered" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newuser = yield db_1.UserModel.create({
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
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const checksuerExist = yield db_1.UserModel.findOne({ email: email });
            console.log(checksuerExist);
            if (!checksuerExist) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, checksuerExist.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid Credentials" });
                return;
            }
            //@ts-ignore
            const token = jsonwebtoken_1.default.sign({ userId: checksuerExist._id }, config_1.JWT_USER_SECRET);
            res.status(200).json({
                message: "login success",
                token: token
            });
            return;
        }
        catch (err) {
            console.log("Error in loginUser:", err);
            res.status(500).json({
                errorr: "Internal Server Error",
                error: err
            });
            return;
        }
    });
}
const transporter = nodemailer_1.default.createTransport({
    //@ts-ignore
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS // Your Gmail password or App Password
    }
});
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const user = yield db_1.UserModel.findOne({ email });
            console.log(user);
            console.log(process.env.EMAIL_USER);
            if (!user) {
                res.status(400).json({ message: "User not found. Please enter a correct email.", valid: false });
                return;
            }
            const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
            ;
            console.log(resetToken);
            const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
            user.resetToken = resetToken;
            user.resetTokenExpiry = tokenExpiry;
            yield user.save();
            const test = yield transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset OTP",
                html: `<h3>Hello ${user.username},</h3>
                    <p>Please verify your email using the following OTP:</p>
                    <h2>${resetToken}</h2>
                    <p>This OTP is valid for 15 minutes.</p>`
            });
            console.log(test);
            res.json({ message: "Please enter the OTP sent to your email.", valid: true, token: resetToken });
        }
        catch (error) {
            res.status(500).json({ message: "Server error. Please try again later.", error });
        }
    });
}
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const user = yield db_1.UserModel.findOne({ resetToken: token });
            if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
                res.status(400).json({ message: "Invalid or expired token.", valid: false });
                return;
            }
            user.resetToken = null;
            user.resetTokenExpiry = null;
            yield user.save();
            res.json({ message: "OTP verified. You can now set a new password.", valid: true });
        }
        catch (error) {
            res.status(500).json({ message: "Intarnal server error", error });
        }
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield db_1.UserModel.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "User not found. Enter a correct email.", valid: false });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            console.log(hashedPassword);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            yield user.save();
            res.json({ message: "Password changed successfully.", valid: true });
        }
        catch (error) {
            res.status(500).json({ message: "Password change failed. Please try again.", valid: false, error });
        }
    });
}
