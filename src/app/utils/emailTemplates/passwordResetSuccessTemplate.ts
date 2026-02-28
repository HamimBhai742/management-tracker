import sendEmail from "./nodemailerTransport";

export const passwordResetSuccessTemplate = async (
  userName: string,
  subject: string,
  email: string,
  loginLink: string
) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Password Reset Successful</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .email-wrapper {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0,0,0,0.06);
  }

  .header {
    padding: 40px 40px 20px;
    text-align: center;
  }

  .logo img {
    width: 130px;
    height: auto;
  }

  .content {
    padding: 0 40px 35px;
    color: #2c3e50;
  }

  .content p {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .button {
    display: inline-block;
    padding: 13px 26px;
    background-color: #10b981;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
  }

  .footer {
    padding: 25px 40px;
    text-align: center;
    border-top: 1px solid #eaeaea;
    font-size: 13px;
    color: #7f8c8d;
  }

  @media only screen and (max-width: 600px) {
    .header,
    .content,
    .footer {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
</style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <div class="email-wrapper">

          <!-- Header -->
          <div class="header">
            <div class="logo">
              <img src="http://16.170.226.171:5001/uploads/da2a090e-5c29-48fe-8351-4eddf559dad1.avif" alt="Management Tracker Logo" />
            </div>
          </div>

          <!-- Content -->
          <div class="content">
            <p>Hello ${userName},</p>

            <p>
              This email confirms that your Management Tracker account password
              has been successfully updated.
            </p>

            <p>
              You can now log in using your new credentials by clicking the button below:
            </p>

            <p style="text-align:center;">
              <a href="${loginLink}" class="button">Log In to Your Account</a>
            </p>

            <p>
              If you did not initiate this change, please contact our support team immediately to secure your account.
            </p>

            <p>
              For security reasons, we recommend reviewing your recent account activity.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            Regards,<br />
            <strong>Management Tracker Team</strong><br />
            © ${new Date().getFullYear()} Management Tracker. All rights reserved.
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail(email, subject, html);
};