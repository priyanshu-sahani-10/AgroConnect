import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendOrderEmail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }

  await transporter.sendMail({
    from: '"AgroConnect" <priyanshusahani038@gmail.com>',
    to,
    subject,
    html,
  });
};
