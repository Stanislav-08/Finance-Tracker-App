import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 1, // serverless: one connection per instance
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;