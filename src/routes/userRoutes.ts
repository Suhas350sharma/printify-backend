import {NextFunction, Router} from "express";
import { createUser, loginUser,forgotPassword,resetPassword,updatePassword,} from "../controllers/userController";
import { usermiddleware } from "../middlewares/userMiddleware";
import session from "express-session";
import passport from "passport";
import "../controllers/googleauth"
const userRouter=Router();


userRouter.post("/signup",createUser);
userRouter.post("/signin",loginUser);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.post("/resetpassword",resetPassword);
userRouter.post("/updatepassword",updatePassword);

userRouter.get('/auth/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
  ));

userRouter.get("/auth/google/callback",
    passport.authenticate('google',{
        successRedirect:'/api/v1/users/protected',
        failureRedirect:'/api/v1/users/auth/google/failure'
    })
);
userRouter.get("/auth/google/failure",(req,res)=>{
    res.send("failed to authenticate")
})
//@ts-ignore
userRouter.get("/protected", isLoggedIn, (req,res)=>{
   res.send("hello world");
})
//@ts-ignore
userRouter.get("/me",usermiddleware, (req,res)=>{
    res.send("protected routes")
})

function isLoggedIn(req:Request,res:Response,next:NextFunction){
    //@ts-ignore
    req.user?next():res.status(500).json({
        message:"You cannot access here"
    })
}

userRouter.get("/logout", (req,res,next)=>{
    if(req.logout){
        req.logout((err)=>{
            if(err){
                return next(err)
            }
            req.session.destroy(()=>{
                res.send("good bye")
            })
        })
    }else{
        res.status(400).json({
            message:"No active sesssion found"
        })
    }
})
export default userRouter;