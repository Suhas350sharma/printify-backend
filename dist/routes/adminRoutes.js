"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const adminRouter = (0, express_1.Router)();
adminRouter.post("/signup", adminController_1.createAdmin);
adminRouter.post("/signin", adminController_1.loginAdmin);
//@ts-ignore
adminRouter.post("/me", adminMiddleware_1.AdminMiddleware, (req, res) => {
    res.send("protected page ");
});
exports.default = adminRouter;
