"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uservalidaion = void 0;
const zod_1 = require("zod");
exports.Uservalidaion = zod_1.z.object({
    username: zod_1.z.string().min(3).max(255),
    PhNo: zod_1.z.string().length(10),
    email: zod_1.z.string().email().min(6).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
    password: zod_1.z.string().min(6).max(255).optional(),
});
