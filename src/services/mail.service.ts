import FailedEmail from "../sequelize/models/failedemail";
import { IUser } from "../types";
import { env } from "../utils/env";
import transporter from "../utils/transporter";
import axios from "axios";
import cron from "node-cron";

export const sendEmailService = async (user: IUser, subject: string, template: any, token?: number) => {
  try {
    const apiEndpoint: any = process.env.URL_SEND_EMAIL;
    const emailData = {
      to: user.email,
      subject: subject,
      body: template,
    };
    
    const response = await axios.post(apiEndpoint, emailData);
  } catch (error: any) {
    try {
      const rs = await FailedEmail.create({
        // @ts-ignore
        userId: user.id,
        email: user.email,
        subject: subject,
        body: template,
        attempts: 1,
        lastAttempted: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const sendNotification = async (email: string | undefined, subject: string, template: any) => {
  try {
    const mailOptions = {
      from: env.smtp_user,
      to: email,
      subject: subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);
    //@ts-ignore
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const retryFailedEmail = async () => {
  const allFailedEmail = await FailedEmail.findAll();

  for (const email of allFailedEmail) {
    try {
      const apiEndpoint: any = process.env.URL_SEND_EMAIL;

      const failedEmailData = {
        to: email.dataValues.email,
        subject: email.dataValues.subject,
        body: email.dataValues.body,
      };

      const response = await axios.post(apiEndpoint, failedEmailData);
      await email.destroy();
    } catch (error: any) {
      email.attempts = email.dataValues.attempts + 1;
      email.dataValues.lastAttempted = new Date();
      await email.save();
      throw new Error(error.message);
    }
  }
};

cron.schedule("0 * * * *", () => {
  retryFailedEmail();
});
