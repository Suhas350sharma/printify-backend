import jwt from "jsonwebtoken"
import { JWT_USER_SECRET } from "../config"
import { Request,Response,NextFunction } from "express"

declare module "express-serve-static-core" {
    interface Request {
        user?: string;
    }
}
export function usermiddleware(req:Request,res:Response,next:NextFunction){
try{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"token missing"})
    }
    console.log(authHeader);
    const decode=jwt.verify(authHeader,JWT_USER_SECRET);
    console.log(decode);
    if(decode ){
       
        req.user=(decode as any ).userId;
        next();
    }
    else{
        res.status(400).json({message:"This page is restricted"});
    }
}catch(error){
    res.status(500).json({message:"Bad Request",error:error})
}
}