"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const filesController_1 = require("../controllers/filesController");
const FileRouter = (0, express_1.Router)();
//@ts-ignore
FileRouter.post("/uploadfiles", userMiddleware_1.usermiddleware, filesController_1.uploadfiles, filesController_1.processFiles);
exports.default = FileRouter;
