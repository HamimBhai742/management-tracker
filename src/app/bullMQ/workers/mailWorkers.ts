import { redisOptions } from "../../lib/redis/redisOptions";
import { Job, Worker } from "bullmq";
import { twoFactorOtpTemplate } from "../../utils/emailTemplates/twoFactorOtpTemplate";
import { passwordChangedTemplate } from "../../utils/emailTemplates/passwordChangedTemplate";
import { passwordResetTemplate } from "../../utils/emailTemplates/passwordResetTemplate";
import { parentApprovalOtpTemplate } from "../../utils/emailTemplates/parentApprovalOtpTemplate";
import { registrationOtpTemplate } from "../../utils/emailTemplates/registrationOtpTemplate";
import { passwordResetSuccessTemplate } from "../../utils/emailTemplates/passwordResetSuccessTemplate";
import { supportAdminTemplate } from "../../utils/emailTemplates/adminSupportTemplate";
import { supportAutoReplyTemplate } from "../../utils/emailTemplates/userAutoReplyTemplate";
import { supportClosedTemplate } from "../../utils/emailTemplates/supportTicketClosedTemplate";
import { loginOtpTemplate } from "../../utils/emailTemplates/loginOtpTemplate";
import { forgotPasswordTemplate } from "../../utils/emailTemplates/forgetPasswordOtpTemplate";

export const otpEmailWorker = new Worker(
  "otp-queue-email",
  async (job: Job) => {
    try {
      if (job.deferredFailure) {
        console.log(`❌ Job ${job.id} was discarded or already processed.`);
        return;
      }
      switch (job.name) {
        case "forgetPassword": {
          const { userName, email, resetLink, subject } = job.data;
          await forgotPasswordTemplate(userName, subject, email, resetLink);
          return "Otp end job completed";
        }
        // handle verify
        case "registrationOtp": {
          const { userName, email, otpCode, subject } = job.data;
          await registrationOtpTemplate(userName, subject, email, otpCode);
          return "Otp end job completed";
        }
        case "loginOtp": {
          const { userName, email, otpCode, subject } = job.data;
          await loginOtpTemplate(userName, subject, email, otpCode);
          return "Otp end job completed";
        }
        case "twoFactorOtp": {
          const { userName, email, otpCode, subject } = job.data;
          await twoFactorOtpTemplate(userName, subject, email, otpCode);
          return "Otp end job completed";
        }
        case "passwordChangedConfirmation": {
          const { userName, email, subject, secureLink } = job.data;
          await passwordChangedTemplate(userName, subject, email, secureLink);
          return "Otp end job completed";
        }
        case "passwordResetRequest": {
          const { userName, email, subject, otpCode } = job.data;
          await passwordResetTemplate(userName, subject, email, otpCode);
          return "Otp end job completed";
        }
        case "parentApprovalOtp": {
          const { userName, email, subject, otpCode } = job.data;
          await parentApprovalOtpTemplate(userName, subject, email, otpCode);
          return "Otp end job completed";
        }
        case "resetPasswordSuccess": {
          const { userName, email, subject, loginLink } = job.data;
          await passwordResetSuccessTemplate(
            userName,
            subject,
            email,
            loginLink,
          );
          return "Otp end job completed";
        }
        case "adminSupport": {
          const { adminEmail, ticket } = job.data;
          await supportAdminTemplate(adminEmail, ticket);
          return "Otp end job completed";
        }
        case "autoReplySupport": {
          const { userEmail, userName, ticketId } = job.data;
          await supportAutoReplyTemplate(userEmail, userName, ticketId);
          return "Otp end job completed";
        }
        case "supportTicketClosed": {
          const { userEmail, userName, ticketId } = job.data;
          await supportClosedTemplate(userEmail, userName, ticketId);
          return "Otp end job completed";
        }

        case "resendParentOtp":
          // handle resend
          break;
      }
    } catch (err) {
      console.error(`❌ Job ${job.id} failed:`, err);
      throw err;
    }
  },
  { connection: redisOptions },
);

otpEmailWorker.on("failed", (job, err) => {
  console.log(`❌ OTP job failed: ${job?.id}`, err);
});

otpEmailWorker.on("completed", (job) => {
  console.log(`✅ OTP job completed: ${job.id}`);
});
