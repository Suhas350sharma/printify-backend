import { NextFunction, Request, Response } from "express";
import { Validation } from "../validations/userValidation";
import { UserModel } from "../db";
import bcrypt from 'bcryptjs';
import { JWT_USER_SECRET } from "../config";
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();


export async function createUser(req: Request, res: Response): Promise<void> {
     try {
          
          const parseData = Validation.safeParse(req.body);
          console.log(parseData);
          if (!parseData.success) {
               res.status(400).json({ error: parseData.error });
               return;
          }
          const { username, PhNo, email, password } = req.body;
          const checkuserExist = await UserModel.findOne({ email: email });
          console.log(checkuserExist);
          if (checkuserExist) {
               res.status(400).json({ message: "This email  was already registered" });
               return;
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newuser = await UserModel.create({
               username: username,
               PhNo: PhNo,
               email: email,
               password: hashedPassword
          });
          console.log(newuser);
          res.status(201).json({ message: "User created successfully", newuser });
          return;
     } catch (err) {

          res.status(500).json({ errorr: "Internal Server Error", error: err });
          return;
     }
}


export async function loginUser(req: Request, res: Response): Promise<void> {
     try {
          const { email, password } = req.body;
          const checksuerExist = await UserModel.findOne({ email: email });
          console.log(checksuerExist);
          if (!checksuerExist) {
               res.status(400).json({ message: "User not found" });
               return;
          }
          const isPasswordValid = await bcrypt.compare(password, checksuerExist.password);
          if (!isPasswordValid) {
               res.status(400).json({ message: "Invalid Credentials" });
               return;
          }
          //@ts-ignore
          const token = jwt.sign({ userId: checksuerExist._id }, JWT_USER_SECRET);
          res.status(200).json({
               message: "login success",
               token: token
          })
          return;
     } catch (err) {
          console.log("Error in loginUser:", err);
          res.status(500).json({
               errorr: "Internal Server Error",
               error: err
          });
          return;
     }
}

const transporter = nodeMailer.createTransport({
     //@ts-ignore
     service:"gmail",
     auth: {
         user: process.env.EMAIL_USER, // Your Gmail address
         pass: process.env.EMAIL_PASS // Your Gmail password or App Password
     }
 });
 
export async function forgotPassword(req: Request, res: Response): Promise<void> {
     try {
          const email  = req.body.email;
          const user = await UserModel.findOne({ email });
          console.log(user);
          console.log(process.env.EMAIL_USER)

          if (!user) {
               res.status(400).json({ message: "User not found. Please enter a correct email.", valid: false });
               return;
          }
          const resetToken = Math.floor(100000 + Math.random() * 900000).toString();;
          console.log(resetToken);
          const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

          user.resetToken = resetToken;
          user.resetTokenExpiry = tokenExpiry;
          await user.save();
         
         const test= await transporter.sendMail({
               from: process.env.EMAIL_USER,
               to: email,
               subject: "Password Reset OTP",
               html: `<h3>Hello ${user.username},</h3>
                    <p>Please verify your email using the following OTP:</p>
                    <h2>${resetToken}</h2>
                    <p>This OTP is valid for 15 minutes.</p>`
          });
          console.log(test);

          res.json({ message: "Please enter the OTP sent to your email.", valid: true,token:resetToken });
     } catch (error) {
          res.status(500).json({ message: "Server error. Please try again later.", error });
     }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
     try {
          const { token } = req.body;
          const user = await UserModel.findOne({ resetToken: token });

          if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
               res.status(400).json({ message: "Invalid or expired token.", valid: false });
               return;
          }

         
          (user as any).resetToken = null;
          (user as any).resetTokenExpiry = null;
          await user.save();


          res.json({ message: "OTP verified. You can now set a new password.", valid: true });
     } catch (error) {
          res.status(500).json({ message: "Intarnal server error", error });
     }
}


export async function updatePassword(req: Request, res: Response): Promise<void> {
     try {
          const { email, password } = req.body;

          const user = await UserModel.findOne({ email });

          if (!user) {
               res.status(400).json({ message: "User not found. Enter a correct email.", valid: false });
               return;
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          console.log(hashedPassword);

          user.password = hashedPassword;
          (user as any).resetToken = null;
          (user as any).resetTokenExpiry = null;
          await user.save();

          res.json({ message: "Password changed successfully.", valid: true });
     } catch (error) {
          res.status(500).json({ message: "Password change failed. Please try again.", valid: false, error });
     }
}

