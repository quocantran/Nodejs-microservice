"use strict";
import OtpService from "./otp.service";
import TemplateService from "./template.service";
import { transporter } from "../dbs/init.nodemailer";

export default class EmailService {
  static sendEmail = async ({ email = "" }) => {
    const token = await OtpService.newOtp({ email });

    // get template email
    const template = await TemplateService.getTemplate({
      templateName: "HTML EMAIL TOKEN",
    });

    // send email
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác nhận địa chỉ Email!",
        html: template.template_content.replace("{{token}}", token.otp_token),
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
    );
  };
}
