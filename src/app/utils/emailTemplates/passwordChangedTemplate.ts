import sendEmail from "./nodemailerTransport";

export const passwordChangedTemplate = async (
  userName: string,
  subject: string,
  email: string,
  secureLink: string,
) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Password Changed</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .email-container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
  }

  .email-header {
    padding: 40px 40px 20px;
    text-align: center;
  }

  .company-logo img {
    width: 130px;
    height: auto;
  }

  .email-content {
    padding: 0 40px 35px;
    color: #2c3e50;
  }

  .email-content p {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .warning-box {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    padding: 16px;
    border-radius: 6px;
    margin: 20px 0;
    font-size: 14px;
    color: #7f1d1d;
  }

  .action-button {
    display: inline-block;
    margin-top: 16px;
    padding: 13px 26px;
    background-color: #ef4444;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  .footer {
    padding: 25px 40px;
    text-align: center;
    border-top: 1px solid #eaeaea;
    font-size: 13px;
    color: #7f8c8d;
  }

  @media only screen and (max-width: 600px) {
    .email-header,
    .email-content,
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
<div class="email-container">

  <!-- Header -->
  <div class="email-header">
    <div class="company-logo">
      <img src="http://16.170.226.171:5001/uploads/da2a090e-5c29-48fe-8351-4eddf559dad1.avif" alt="Management Tracker Logo" />
    </div>
  </div>

  <!-- Content -->
  <div class="email-content">
    <p>Hello ${userName},</p>

    <p>
      This email confirms that your <strong>Management Tracker</strong> account password
      was successfully changed.
    </p>

    <div class="warning-box">
      If you made this change, no further action is required.  
      If you did <strong>not</strong> perform this action, your account may be compromised.
    </div>

    <p>
      Please secure your account immediately by reviewing your account activity
      and updating your credentials.
    </p>

    <p style="text-align:center;">
      <a href="${secureLink}" class="action-button">
        Secure My Account
      </a>
    </p>

    <p style="margin-top: 20px;">
      For enhanced security, we strongly recommend enabling two-factor authentication (2FA).
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