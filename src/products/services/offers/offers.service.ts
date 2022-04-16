import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { CreateOfferDTO } from 'src/products/models/create-offer.dto';
import { Item } from 'src/products/models/item.entity';
import { Offer } from 'src/products/models/offer.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    @InjectRepository(Item) private itemsRepo: Repository<Item>,
  ) {}

  async getAll(): Promise<Offer[]> {
    return await this.offersRepo.find();
  }

  async getOne(id: number): Promise<Offer> {
    return await this.offersRepo.findOne({ id });
  }

  async create(offerDto: CreateOfferDTO): Promise<number> {
    const items = await this.itemsRepo.find({ id: In(offerDto.items) });

    const ids = items.map((item) => Number(item.id));

    offerDto.items.forEach((id) => {
      if (!ids.includes(id)) {
        throw new HttpException(
          `ITEM_ID_NOT_FOUND: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
    });

    const plainDto = instanceToPlain(offerDto);
    const offer = plainToClass(Offer, plainDto);
    offer.items = items;

    const newOffer = await this.offersRepo.create(offer);

    await this.offersRepo.save(newOffer);

    return newOffer.id;
  }
}
