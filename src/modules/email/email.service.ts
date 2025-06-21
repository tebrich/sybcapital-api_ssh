import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.MAIL_PASSWORD); // o usa MAIL_SENDGRID_API_KEY si querés otro nombre
  }

  async sendWelcomeEmail(to: string, name: string) {
    const msg = {
      to,
      from: {
        email: process.env.MAIL_FROM || 'no-reply@sybcapital.com',
        name: process.env.MAIL_NAME || 'SyB Capital',
      },
      subject: 'Bienvenido a SyB Capital',
      html: `
        <h1>Hola ${name}</h1>
        <p>Gracias por suscribirte a nuestro Newsletter.</p>
        <p>SyB Capital</p>
      `,
    };

    await sgMail.send(msg);
  }
}

