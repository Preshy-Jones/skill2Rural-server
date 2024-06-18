export const forgotPasswordTemplate = (magicLink, username) => `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 5px;">
        <h1 style="color: #333;">Reset Your Password</h1>

        <p>Hello ${username},</p>

        <p>We received a request to reset the password for your account. If you made this request, please click the button below to continue.</p>

        <a href="${magicLink}" style="background-color: #60269E; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: block; margin: 20px auto; border-radius: 5px; border: none;">Reset Password</a> 

        <p><strong>If you don’t use this link within 3 hours, it will expire.</strong></p>

        <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>

        <p>Thank you,<br>
        The Skill2rural Team</p>
    </div>
</body>
`;
