"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)({
    origin: " http://192.168.18.74:40383 ",
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/admin", adminRoutes_1.default);
app.use("/api/v1/files", fileRoutes_1.default);
// app.get("/protected", (req,res)=>{
//     res.send("hello world");
//  })
app.listen(3001, () => {
    console.log('Server is running on port 3000');
});
