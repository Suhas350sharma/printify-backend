import jwt from "jsonwebtoken"
import { JWT_ADMIN_SECRET } from "../config"
import { Request,Response,NextFunction } from "express"

declare module "express-serve-static-core" {
    interface Request {
        admin?: string;
    }
}
export function AdminMiddleware(req:Request,res:Response,next:NextFunction){
try{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"token missing"})
    }
    console.log(authHeader);
    const decode=jwt.verify(authHeader,JWT_ADMIN_SECRET);
    console.log(decode);
    if(decode ){
       
        req.admin=(decode as any ).id;
        next();
    }
    else{
        res.status(400).json({message:"This page is restricted"});
    }
}catch(error){
    res.status(500).json({message:"Bad Request",error:error})
}
}