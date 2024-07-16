import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    // Use `true` for port 465, `false` for all other ports
    service: "gmail",
    auth: {
      user: "loayalkashif@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"A5ook loay 😁" <loayalkashif@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Tasks App",
    text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
  });

  console.log("Message sent: %s", info.messageId);
};
