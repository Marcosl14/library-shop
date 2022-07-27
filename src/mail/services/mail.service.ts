import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cart } from 'src/cart/models/cart.entity';
import { EmailChange } from 'src/users/models/email-change.entity';
import { User } from 'src/users/models/user.entity';
import constants from '../constants/env.constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, registryUUID: string) {
    const url = `${constants().FRONT_URL}/confirmar/${registryUUID}`;
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
    const url = `${constants().FRONT_URL}/confirmar-email/${emailChange.uuid}`;
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

  async sendPasswordChange(user: User, password: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenido a Librería Punto & Coma! Cambio de Password',
      template: '../password-forgotten-change.hbs',
      context: {
        name: user.firstname,
        password: password,
      },
    });
  }

  async replyToSales(user: User, cart: Cart) {
    let finalPrice = 0;

    cart.cartItems.forEach((cartItem) => {
      finalPrice += cartItem.item.priceWithDiscount * cartItem.quantity;
    });

    cart.cartOffers.forEach((cartOffer) => {
      finalPrice += cartOffer.offer.priceWithDiscount * cartOffer.quantity;
    });

    await this.mailerService.sendMail({
      to: constants().REPLY_TO_MAIL,
      subject: 'Se ha registrado una nueva compra en Librería Punto & Coma!!!',
      template: '../new-sale.hbs',
      context: {
        name: `${user.firstname} ${user.lastname}`,
        phone: user.phone,
        email: user.email,
        items: cart.cartItems,
        offers: cart.cartOffers,
        finalPrice: finalPrice.toFixed(2),
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

  @OnEvent('password.forgotten')
  sendPasswordForgottenEmail(user: User, password: string) {
    this.sendPasswordChange(user, password);
  }

  @OnEvent('purchase.created')
  notificationToSalesDepartment(user: User, cart: Cart) {
    this.replyToSales(user, cart);
  }
}
