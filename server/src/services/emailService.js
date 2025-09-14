import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

let transporter;
export function getTransporter() {
  if (transporter) return transporter;

  if (ENV.SMTP_HOST && ENV.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: Number(ENV.SMTP_PORT || 587),
      secure: ENV.SMTP_PORT == 465,
      auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS },
    });
  } else {
    //fallback: ethereal or a no-op transporter for local dev
    transporter = {
      sendMail: async (opts) => {
        logger.info("Simulated sendEmail:", opts);
        return { messageId: "simulated" };
      },
    };
  }
  return transporter;
}

export async function sendOrderEmail(to, subject, html) {
  const t = getTransporter();
  const info = await t.sendMail({
    from: ENV.EMAIL_FROM || "no-reply@example.com",
    to,
    subject,
    html,
  });
  logger.info(`Email sent: ${info.messageId}`);
  if (nodemailer.getTestMessageUrl) {
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  return info;
}
