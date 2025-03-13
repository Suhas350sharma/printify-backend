import {Router} from "express";
import { createAdmin,loginAdmin } from "../controllers/adminController";
import { AdminMiddleware } from "../middlewares/adminMiddleware";

const adminRouter=Router();

adminRouter.post("/signup",createAdmin);
adminRouter.post("/signin",loginAdmin);
//@ts-ignore
adminRouter.post("/me",AdminMiddleware,(req,res)=>{
    res.send("protected page ");
})

export default adminRouter;