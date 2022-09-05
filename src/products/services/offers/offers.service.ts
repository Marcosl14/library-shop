import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { CreateOfferDTO } from 'src/products/models/create-offer.dto';
import { Item } from 'src/products/models/item.entity';
import { OfferItem } from 'src/products/models/offer-item.entity';
import { Offer } from 'src/products/models/offer.entity';
import { UpdateOfferDTO } from 'src/products/models/update-offer.dto';
import { In, Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    @InjectRepository(OfferItem) private offerItemsRepo: Repository<OfferItem>,
    @InjectRepository(Item) private itemsRepo: Repository<Item>,
  ) {}

  async getAll(): Promise<Offer[]> {
    return await this.offersRepo.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getOne(id: number): Promise<Offer> {
    return await this.offersRepo.findOne({ id });
  }

  async create(offerDto: CreateOfferDTO): Promise<number> {
    const itemsIds = offerDto.items.map((item) => Number(item.id));

    const foundItems = await this.itemsRepo.find({ id: In(itemsIds) });

    const rawOfferItems: OfferItem[] = this.createRawOfferItems(
      offerDto,
      foundItems,
    );

    const newOfferItems: OfferItem[] = await this.createOfferItems(
      rawOfferItems,
    );

    delete offerDto.items;

    const plainDto = instanceToPlain(offerDto);
    const offer = plainToClass(Offer, plainDto);
    offer.offerItems = newOfferItems;
    offer.price = offer.offerItems
      .map((offerItem) => offerItem.item.price * offerItem.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    const newOffer = await this.offersRepo.create(offer);

    const savedOffer = await this.offersRepo.save(newOffer);

    return savedOffer.id;
  }

  async update(id: number, offerDto: UpdateOfferDTO): Promise<number> {
    const foundOffer = await this.offersRepo.findOne(id);

    if (!foundOffer) {
      throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const oldOfferItemsIds = foundOffer.offerItems.map(
      (offerItem) => offerItem.id,
    );

    const itemsIds = offerDto.items.map((item) => Number(item.id));

    const foundItems = await this.itemsRepo.find({ id: In(itemsIds) });

    const rawOfferItems: OfferItem[] = this.createRawOfferItems(
      offerDto,
      foundItems,
    );

    const newOfferItems: OfferItem[] =
      await this.updateOrCreateOfferItemsIfNotFound(foundOffer, rawOfferItems);

    delete offerDto.items;

    const plainDto = instanceToPlain(offerDto);
    const offer = plainToClass(Offer, plainDto);
    offer.offerItems = newOfferItems;
    offer.price = offer.offerItems
      .map((offerItem) => offerItem.item.price * offerItem.quantity)
      .reduce((prev, curr) => prev + curr, 0);
    offer.id = id;

    const updatedOffer = await this.offersRepo.save(offer);

    const newOfferItemsIds = updatedOffer.offerItems.map(
      (newOfferItem) => newOfferItem.id,
    );

    oldOfferItemsIds.forEach((oldOfferItemId) => {
      if (!newOfferItemsIds.includes(oldOfferItemId)) {
        this.offerItemsRepo.delete(oldOfferItemId);
      }
    });

    return updatedOffer.id;
  }

  async delete(id: number): Promise<void> {
    const offer = await this.offersRepo.findOne(id);

    if (!offer) {
      throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.offersRepo.delete(id);
  }

  createRawOfferItems(offerDto, items): OfferItem[] {
    const itemsIds = items.map((item) => Number(item.id));

    const rawOfferItems: OfferItem[] = [];
    offerDto.items.forEach((item) => {
      if (!itemsIds.includes(item.id)) {
        throw new HttpException(
          `ITEM_ID_NOT_FOUND: ${item.id}`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        const offerItem = new OfferItem();
        offerItem.item = items.find((element) => element.id == item.id);
        offerItem.quantity = offerDto.items.find(
          (element) => element.id == item.id,
        ).quantity;
        rawOfferItems.push(offerItem);
      }
    });
    return rawOfferItems;
  }

  async createOfferItems(rawOfferItems): Promise<OfferItem[]> {
    const newOfferItems: OfferItem[] = [];
    for (let index = 0; index < rawOfferItems.length; index++) {
      newOfferItems.push(await this.offerItemsRepo.save(rawOfferItems[index]));
    }

    return newOfferItems;
  }

  async updateOrCreateOfferItemsIfNotFound(
    offer,
    rawOfferItems,
  ): Promise<OfferItem[]> {
    const newOfferItems: OfferItem[] = [];

    for (let index = 0; index < rawOfferItems.length; index++) {
      const foundOfferItem = offer.offerItems.find(
        (offerItem) => offerItem.item.id == rawOfferItems[index].item.id,
      );

      if (foundOfferItem) {
        foundOfferItem.quantity = rawOfferItems[index].quantity;
        await this.offerItemsRepo.update(foundOfferItem.id, foundOfferItem),
          newOfferItems.push(foundOfferItem);
      } else {
        newOfferItems.push(
          await this.offerItemsRepo.save(rawOfferItems[index]),
        );
      }
    }

    return newOfferItems;
  }
}
