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

    const offerExists = await this.offerExists(itemsIds);

    if (offerExists) {
      throw new HttpException('OFFER_ALREADY_EXISTS', HttpStatus.CONFLICT);
    }

    const foundItems = await this.itemsRepo.find({ id: In(itemsIds) });
    const foundItemsIds = foundItems.map((item) => Number(item.id));

    const rawOfferItems: OfferItem[] = this.findRawOfferItems(
      offerDto,
      foundItemsIds,
      foundItems,
    );

    const newOfferItems: OfferItem[] = await this.createOfferItemsIfNotFound(
      rawOfferItems,
    );

    delete offerDto.items;

    const plainDto = instanceToPlain(offerDto);
    const offer = plainToClass(Offer, plainDto);
    offer.offerItems = newOfferItems;

    const newOffer = await this.offersRepo.create(offer);

    const savedOffer = await this.offersRepo.save(newOffer);

    return savedOffer.id;
  }

  async update(id: number, offerDto: UpdateOfferDTO): Promise<number> {
    const foundOffer = await this.offersRepo.findOne(id);

    if (!foundOffer) {
      throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const itemsIds = offerDto.items.map((item) => Number(item.id));

    const offerExists = await this.offerExists(itemsIds);

    if (offerExists && offerExists != id) {
      throw new HttpException('OFFER_ALREADY_EXISTS', HttpStatus.CONFLICT);
    }

    const foundItems = await this.itemsRepo.find({ id: In(itemsIds) });
    const foundItemsIds = foundItems.map((item) => Number(item.id));

    const rawOfferItems: OfferItem[] = this.findRawOfferItems(
      offerDto,
      foundItemsIds,
      foundItems,
    );

    const newOfferItems: OfferItem[] = await this.createOfferItemsIfNotFound(
      rawOfferItems,
    );

    delete offerDto.items;

    const plainDto = instanceToPlain(offerDto);
    const offer = plainToClass(Offer, plainDto);
    offer.offerItems = newOfferItems;
    offer.id = id;

    const updatedOffer = await this.offersRepo.save(offer);
    return updatedOffer.id;
  }

  async delete(id: number): Promise<void> {
    const offer = await this.offersRepo.findOne(id);

    if (!offer) {
      throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.offersRepo.softDelete(id);
  }

  async offerExists(itemsIds): Promise<number> {
    const offersMatching = await this.offersRepo
      .createQueryBuilder('offers')
      .select(['offers.id', 'ooioi.offerItemsId', 'oi.item_id'])
      .innerJoin(
        'offers_offer_items_offer_items',
        'ooioi',
        'offers.id = ooioi.offersId',
      )
      .innerJoin('offer_items', 'oi', 'ooioi.offerItemsId = oi.id')
      .where(`oi.item_id IN(${itemsIds})`)
      .getRawMany();

    const filteredOffers = new Set();
    offersMatching.forEach((element) => {
      filteredOffers.add(element.offers_id);
    });

    const foundOffers = await this.offersRepo.find({
      where: {
        id: In([...filteredOffers]),
      },
    });

    for (let x = 0; x < foundOffers.length; x++) {
      const offerItem = foundOffers[x].offerItems;

      const foundItemsIds = [];
      for (let y = 0; y < offerItem.length; y++) {
        foundItemsIds.push(offerItem[y].item.id);
      }

      if (foundItemsIds.sort().join(',') === itemsIds.sort().join(',')) {
        return foundOffers[x].id;
      }
    }

    return null;
  }

  findRawOfferItems(offerDto, itemsIds, items): OfferItem[] {
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

  async createOfferItemsIfNotFound(rawOfferItems): Promise<OfferItem[]> {
    const foundOfferItems = await this.offerItemsRepo.find({
      where: {
        item: In(rawOfferItems.map((element) => element.item.id)),
        quantity: In(rawOfferItems.map((element) => element.quantity)),
      },
    });

    const newOfferItems: OfferItem[] = [];
    for (let index = 0; index < rawOfferItems.length; index++) {
      if (
        foundOfferItems
          .map((foundOfferItem) => foundOfferItem.item.id)
          .includes(rawOfferItems[index].item.id)
      ) {
        newOfferItems.push(
          foundOfferItems.find(
            (foundOfferItem) =>
              foundOfferItem.item.id == rawOfferItems[index].item.id,
          ),
        );
      } else {
        newOfferItems.push(
          await this.offerItemsRepo.save(rawOfferItems[index]),
        );
      }
    }

    return newOfferItems;
  }
}
