import { Validation } from "../validations/userValidation";
import { Request,Response } from "express";
import { AdminModel } from "../db";
import bcrypt from 'bcryptjs';
import { JWT_ADMIN_SECRET } from "../config";
import jwt from 'jsonwebtoken';

export async function createAdmin(req: Request, res: Response): Promise<void> {
     try {
          
          const parseData = Validation.safeParse(req.body);
          console.log(parseData);
          if (!parseData.success) {
               res.status(400).json({ error: parseData.error });
               return;
          }
          const { username, PhNo, email, password } = req.body;
          const checkuserExist = await AdminModel.findOne({ email: email });
          console.log(checkuserExist);
          if (checkuserExist) {
               res.status(400).json({ message: "This email  was already registered" });
               return;
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newuser = await AdminModel.create({
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

export async function loginAdmin(req: Request, res: Response): Promise<void> {
     try {
          const { email, password } = req.body;
          const checkAdminexist = await AdminModel.findOne({ email: email });
          console.log(checkAdminexist);
          if (!checkAdminexist) {
               res.status(400).json({ message: "User not found" });
               return;
          }
          const isPasswordValid = await bcrypt.compare(password, checkAdminexist.password);
          if (!isPasswordValid) {
               res.status(400).json({ message: "Invalid Credentials" });
               return;
          }
          //@ts-ignore
          const token = jwt.sign({ id: checkAdminexist._id }, JWT_ADMIN_SECRET);
          res.status(200).json({
               message: "login success",
               token: token
          })
          return;
     } catch (err) {
          console.log("Error in loginAdmin:", err);
          res.status(500).json({
               errorr: "Internal Server Error",
               error: err
          });
          return;
     }
}
