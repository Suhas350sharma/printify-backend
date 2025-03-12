import express from 'express';
import userRouter from './routes/userRoutes';
import session from "express-session";
import passport from "passport";



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

app.use(express.json());
app.use("/api/v1/users", userRouter);
// app.get("/protected", (req,res)=>{
//     res.send("hello world");
//  })

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
