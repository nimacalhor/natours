import { createTransport } from "nodemailer";
import type { SendMailOptions } from "nodemailer";

const host = process.env.EMAIL_HOST as string;
const port = process.env.EMAIL_PORT as string;
const user = process.env.EMAIL_USERNAME as string;
const pass = process.env.EMAIL_PASSWORD as string;

const sendMail = async function (options: SendMailOptions) {
  const transporter = createTransport({
    host,
    port,
    auth: { user, pass },
    secureConnection: false,
  } as any);

  const { to, from = "Nima Kalhor", subject, text } = options;
  const mailOptions = { to, from, subject, text };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
