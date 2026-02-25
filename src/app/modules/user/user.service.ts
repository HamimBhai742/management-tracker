import config from "../../../config";
import { Prisma } from "../../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";
import { generateOTP } from "../../utils/generateOTP";
import { otpQueueEmail } from "../../bullMQ/init";

const registerUser = async (payload: Prisma.UserCreateInput) => {
  const { password } = payload;
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
  payload.password = hashedPassword;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  payload.otp = otp;
  payload.otpExpires = otpExpiry;

  // create user
  const user = await prisma.user.create({ data: payload });

  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: payload.name,
      email: payload.email,
      otpCode: otp,
      subject: "Verify your email address",
    },
    {
      jobId: `JobId-${payload.id}`,
      attempts: 5,
      removeOnComplete: true,
      backoff: {
        type: "fixed",
        delay: 5000, // 5 seconds
      },
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

export const userService = {
  registerUser,
};
