import { AppError } from "../../error";
import { generateToken } from "../../utils/generateToken";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!user.isEmailVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is not verified");
  }
  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.UNAUTHORIZED, `User is ${user.status}`);
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const token= await generateToken(user);
  return {
    accessToken: token
  };
};


export const authService = { login };
