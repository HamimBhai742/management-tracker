import sendEmail from "./nodemailerTransport";

export const forgotPasswordTemplate = async (
  userName: string,
  subject: string,
  email: string,
  resetLink: string
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Request</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    color: #2c3e50;
  }

  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
  }

  .header {
    background-color: #225ce4;
    padding: 30px;
    text-align: center;
    color: #fff;
  }

  .header img {
    max-width: 120px;
    margin-bottom: 10px;
  }

  .content {
    padding: 35px 30px;
    font-size: 15px;
    line-height: 1.6;
  }

  .button-wrapper {
    text-align: center;
    margin: 30px 0;
  }

  .reset-button {
    display: inline-block;
    padding: 14px 28px;
    background-color: #225ce4;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 15px;
  }

  .reset-button:hover {
    background-color: #1a3dbd;
  }

  .footer {
    text-align: center;
    font-size: 13px;
    color: #7f8c8d;
    padding: 25px;
    border-top: 1px solid #eaeaea;
  }

  @media only screen and (max-width: 600px) {
    .content {
      padding: 25px 20px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="http://16.170.226.171:5001/uploads/da2a090e-5c29-48fe-8351-4eddf559dad1.avif" alt="Management Tracker Logo">
      <h1>Management Tracker</h1>
    </div>

    <div class="content">
      <p>Hi ${userName},</p>

      <p>We received a request to reset the password for your Management Tracker account.</p>

      <p>Please click the button below to set a new password. This link will expire shortly for security reasons.</p>

      <div class="button-wrapper">
        <a href="${resetLink}" class="reset-button">Reset Your Password</a>
      </div>

      <p>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>

      <p>For security reasons, please do not share this link with anyone.</p>

      <p>Best regards,<br><strong>Management Tracker Team</strong></p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Management Tracker. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  await sendEmail(email, subject, html);
};