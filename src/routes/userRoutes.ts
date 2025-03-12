import {Router} from "express";
import { createUser, loginUser,forgotPassword,resetPassword,updatePassword,} from "../controllers/userController";
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
        successRedirect:'/protected',
        failureRedirect:'/api/v1/users/auth/google/failure'
    })
);
userRouter.get("/auth/google/failure",(req,res)=>{
    res.send("failed to authenticate")
})
userRouter.get("/protected", (req,res)=>{
   res.send("hello world");
})

userRouter.get("/logout",(req,res)=>{
    //@ts-ignore
    req.logout();
    //@ts-ignore
    req.session.destroy();
    res.send("goodbye!")
})

export default userRouter;