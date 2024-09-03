import nodemailer from 'nodemailer';

class Email {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'price.murphy@ethereal.email',
        pass: 'Zq1zNWN3djDCnDt2cj'
      }
    })
  }

  public async send(from: string, to: string, subject: string, text: string, html: string) {
    await this.transporter.sendMail({ from, to, subject, text, html });
    console.log('Send email successfully');
  }
}

export const email: Email = new Email();