import nodemailer from 'nodemailer';
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
})

export const sendVerifyEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Xác thực tài khoản',
    html: `
      <p>Hãy vui lòng ấn vào đường link phía dưới để xác thực tài khoản</p>
      <p><a href='${verifyUrl}'>Link</a></p>
      <p>Đường link này sẽ hết hạn sau 1 tiếng</p>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
            <p>Hãy vui lòng ấn vào đường link phía dưới để đặt lại mật khẩu</p>
            <p><a href='${resetUrl}'>Link</a></p>
            <p>Đường link này sẽ hết hạn sau 1 tiếng</p>
        `
    };

    await transporter.sendMail(mailOptions);
}; // không sử dụng nữa, vì admin đã làm chức năng này