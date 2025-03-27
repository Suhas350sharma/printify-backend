import express from 'express';
import userRouter from './routes/userRoutes';
import session from "express-session";
import passport from "passport";
import adminRouter from './routes/adminRoutes';
import FileRouter from './routes/fileRoutes';
import cors from 'cors'

const app=express();
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'cats', 
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin:"  http://192.168.18.74:3000",
    credentials:true
}))
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/files",FileRouter)
// app.get("/protected", (req,res)=>{
//     res.send("hello world");
//  })

app.listen(3001,()=>{
    console.log('Server is running on port 3000');
})
