import { PrismaClient } from '../generated/prisma/client.js';
import dotenv from "dotenv";

dotenv.config();
if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL must be defined in the environment variables.");
}
const prisma=new PrismaClient({
    log: ["query"]
})

export default prisma