import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { globalConstants } from 'src/constants/constants';
import { MoreThan, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { EmailChange } from '../models/email-change.entity';
import { User } from '../models/user.entity';

@Injectable()
export class EmailChangeService {
  constructor(
    @InjectRepository(EmailChange)
    private emailChangeRepo: Repository<EmailChange>,
  ) {}

  async findOneByUUID(uuid: uuid): Promise<EmailChange> {
    return this.emailChangeRepo.findOne({ uuid });
  }

  async isEmailChangeInProgress(user: User): Promise<boolean> {
    const expirationTime = Date.now() - globalConstants.MILLIS_IN_24_HOURS;

    const q = this.emailChangeRepo
      .createQueryBuilder()
      .where({ user })
      .andWhere({ confirmed: false })
      .andWhere({ createdAt: MoreThan(new Date(expirationTime)) })
      .getOne();

    if (await q) {
      return true;
    }

    return false;
  }

  async isEmailChangeValid(uuid: uuid): Promise<EmailChange> {
    const expirationTime = Date.now() - globalConstants.MILLIS_IN_24_HOURS;

    const emailChange = this.emailChangeRepo
      .createQueryBuilder()
      .where({ uuid })
      .andWhere({ createdAt: MoreThan(new Date(expirationTime)) })
      .getOne();

    return emailChange;
  }

  async updateConfirmation(uuid: uuid) {
    this.emailChangeRepo.update({ uuid }, { confirmed: true });
  }

  async create(newEmail: string, user: User): Promise<EmailChange> {
    const emailChange: EmailChange = new EmailChange();
    emailChange.newEmail = newEmail;
    emailChange.oldEmail = user.email;
    emailChange.user = user;

    const emailChangeDB: EmailChange = await this.emailChangeRepo.create(
      emailChange,
    );

    return await this.emailChangeRepo.save(emailChangeDB);
  }
}
