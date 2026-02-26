// import 'dotenv/config'
// import { PrismaClient } from '../../generated/prisma/client'
// import { PrismaNeon } from '@prisma/adapter-neon'

// const adapter = new PrismaNeon({
//   connectionString: process.env.DATABASE_URL!,
// })

// export const prisma = new PrismaClient({ adapter })

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });