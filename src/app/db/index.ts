import config from "../../config";
import { Role } from "../interface/user.interface";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

const adminData = {
  name: " Admin",
  email: config.admin.email,
  password: config.admin.password,
  role: Role.ADMIN,
  isEmailVerified: true,
};
//create seed admin
const seedAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isAdminExists = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    // If not, create one
    if (!isAdminExists) {
      adminData.password = await bcrypt.hash(
        config.admin.password as string,
        Number(config.bcrypt_salt_rounds) || 12,
      );
      await prisma.user.create({
        data: adminData,
      });
    } else {
      console.log(" Admin already exists.");
      return;
    }
  } catch (error) {
    console.error("Error seeding  Admin:", error);
  }
};

export default seedAdmin;
