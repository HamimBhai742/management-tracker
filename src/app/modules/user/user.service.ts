import config from "../../../config";
import { Prisma, User } from "../../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";
import { generateOTP } from "../../utils/generateOTP";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error";
import httpStatus from "http-status";
import { generateForgetToken } from "../../utils/generateToken";
import { verifyToken } from "../../utils/verifyToken";

const registerUser = async (payload: Prisma.UserCreateInput) => {
  const { password } = payload;
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
  payload.password = hashedPassword;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  payload.otp = otp;
  payload.otpExpires = otpExpiry;
  console.log(payload);
  // create user
  const user = await prisma.user.create({ data: payload });

  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: user.name,
      email: user.email,
      otpCode: otp,
      subject: "Your Verification OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

const otpVerify = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.otp !== otp) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  }
  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new AppError(httpStatus.UNAUTHORIZED, "OTP has expired");
  }

  await prisma.user.update({
    where: { email },
    data: {
      isEmailVerified: true,
      otp: null,
      otpExpires: null,
    },
  });
  return {
    name: user.name,
  };
};

const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isEmailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  await prisma.user.update({
    where: { email },
    data: {
      otp: otp,
      otpExpires: otpExpiry,
    },
  });

  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: user.name,
      email: user.email,
      otpCode: otp,
      subject: "Your Verification OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

const forgetPassword = async (email: string) => {
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

  const token = await generateForgetToken(
    user,
    config.jwt.access_secret as string,
    "5m",
  );

  await otpQueueEmail.add(
    "forgetPassword",
    {
      userName: user.name,
      email: user.email,
      subject: "Reset Password",
      resetLink: `http://16.170.226.171:5001/reset-password?token=${token}`,
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

const resetPassword = async (token: string, password: string) => {
  const verifiedToken = await verifyToken(
    token,
    config.jwt.access_secret as string,
  );

  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.userId },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const updateUser = async (id: string, payload: Partial<User>) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      config.bcrypt_salt_rounds,
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
  });
  return updatedUser;
};

export const userService = {
  registerUser,
  otpVerify,
  resendOtp,
  forgetPassword,
  getAllUsers,
  updateUser,
  resetPassword,
};
