import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("MONGO_URL:", process.env.MONGO_URL); 
console.log("JWT_USER_SECRET:", process.env.JWT_USER_SECRET); 

export const MONGO_URL = process.env.MONGO_URL!;
export const JWT_USER_SECRET = process.env.JWT_USER_SECRET!;
export const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET!;
