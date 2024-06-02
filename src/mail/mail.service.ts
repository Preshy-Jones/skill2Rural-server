import { Injectable } from "@nestjs/common";
import mailgun from "mailgun-js";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { SendMailDto } from "./dto/send-mail.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  sendMailNodeMailer(createMailDto: SendMailDto) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: createMailDto.to,
      subject: createMailDto.subject,
      text: createMailDto.text,
      html: createMailDto.html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return true;
  }
  sendMailMailGun(sendMailDto: SendMailDto) {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    const data = {
      from: "Excited User",
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
      html: sendMailDto.html,
    };
    mg.messages().send(data, (error, body) => {
      if (error) {
        console.log(error);
      }
      console.log(body);
    });
    return `This action sends a mail to ${sendMailDto.to}`;
  }

  sendMailResend(sendMailDto: SendMailDto) {
    console.log(this.configService.get("RESEND_API_KEY"));

    const resend = new Resend(this.configService.get("RESEND_API_KEY"));

    // resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: "skillrural@gmail.com",
    //   subject: "Hello World",
    //   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    // });

    const payload = {
      from: "SKILL2RURAL",
      to: "delivered@resend.dev",
      subject: sendMailDto.subject,
      html: sendMailDto.html,
      text: sendMailDto.text,
    };
    console.log(payload);

    resend.emails.send({
      from: "SKILL2RURAL",
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      html: sendMailDto.html,
      text: sendMailDto.text,
    });
  }
}
