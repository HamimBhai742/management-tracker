import config from "../../../config";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error";
import { generateToken } from "../../utils/generateToken";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

const login = async (email: string, password: string) => {
  console.log(email, password);
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

  const token = await generateToken(user);
  console.log(token);
  return {
    accessToken: token,
  };
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
  }

  if (newPassword === oldPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be same as old password",
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds,
  );
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  await otpQueueEmail.add(
    "passwordChangedConfirmation",
    {
      userName: user.name,
      email: user.email,
      subject: "Password Changed Confirmation",
      secureLink: `http://localhost:3000/verify-password-change/${user.id}`,
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );
};

const authMe = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const authService = { login, changePassword, authMe };
