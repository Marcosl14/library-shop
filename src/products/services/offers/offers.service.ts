import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from 'src/products/models/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(@InjectRepository(Offer) private offersRepo: Repository<Offer>) {}

  async getOffers(): Promise<Offer[]> {
    return await this.offersRepo.find();
  }
}
