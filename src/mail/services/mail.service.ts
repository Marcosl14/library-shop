import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

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

  @OnEvent('registration.in_progress')
  resendConfirmationEmail(user: User, registryUUID: string) {
    this.sendUserConfirmation(user.email, registryUUID);
  }

  @OnEvent('registration.update_uuid')
  sendConfirmationEmail(user: User, registryUUID: string) {
    this.sendUserConfirmation(user.email, registryUUID);
  }
}
