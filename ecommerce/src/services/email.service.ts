"use strict";
import OtpService from "./otp.service";
import TemplateService from "./template.service";
import { transporter } from "../dbs/init.nodemailer";
import { BadRequestError } from "../core/error.response";
import { replacePlaceHolder } from "../utils";
import elasticLogger from "../loggers/elastic.log";

export default class EmailService {
  static sendEmail = async ({ email = "" }) => {
    const token = await OtpService.newOtp({ email });

    // get template email
    const template = await TemplateService.getTemplate({
      templateName: "HTML EMAIL TOKEN",
    });

    if (!template) {
      throw new BadRequestError("Template not found!");
    }

    //replace placeholder

    const content = replacePlaceHolder(template.template_content, {
      link_verify: `http://localhost:3055/api/v1/user/verify?token=${token.otp_token}`,
    });

    // send email
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác nhận địa chỉ Email!",
        html: content,
      },
      async (err, info) => {
        if (err) {
          await elasticLogger(err, 400);
        } else {
          console.log(info);
        }
      }
    );
    return "Send email success!";
  };
}
