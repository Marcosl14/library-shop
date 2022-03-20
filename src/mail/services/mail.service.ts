import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailChange } from 'src/users/models/email-change.entity';

import { User } from 'src/users/models/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, registryUUID: string) {
    const url = `example.com/auth/confirm?registry-uuid=${registryUUID}`;
    await this.mailerService.sendMail({
      to: email,
      subject:
        'Bienvenido a Librería Punto & Coma! Por favor, confirma tu email',
      template: '../registry-confirmation',
      context: {
        url,
      },
    });
  }

  async sendEmailChange(emailChange: EmailChange) {
    const url = `example.com/auth/confirm?registry-uuid=${emailChange.uuid}`;
    await this.mailerService.sendMail({
      to: emailChange.newEmail,
      subject:
        'Bienvenido a Librería Punto & Coma! Por favor, confirma tu cambio de email',
      template: '../email-change-confirmation.hbs',
      context: {
        name: emailChange.user.firstname,
        url,
      },
    });
  }

  @OnEvent('registration.in_progress')
  resendConfirmationEmail(user: User, registryUUID: string) {
    this.sendUserConfirmation(user.email, registryUUID);
  }

  @OnEvent('registration.update_uuid')
  sendConfirmationEmail(user: User, registryUUID: string) {
    this.sendUserConfirmation(user.email, registryUUID);
  }

  @OnEvent('email_change.in_progress')
  sendEmailChangeEmail(emailchange: EmailChange) {
    this.sendEmailChange(emailchange);
  }
}
