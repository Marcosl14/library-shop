import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './controllers/items/items.controller';
import { Category } from './models/categories.entity';
import { Item } from './models/item.entity';
import { ItemsService } from './services/items/items.service';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CategoriesService } from './services/categories/categories.service';
import { OffersController } from './controllers/offers/offers.controller';
import { OffersService } from './services/offers/offers.service';
import { Offer } from './models/offer.entity';
import { OfferItem } from './models/offer-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, Offer, OfferItem])],
  controllers: [ItemsController, CategoriesController, OffersController],
  providers: [ItemsService, CategoriesService, OffersService],
  exports: [ItemsService, OffersService],
})
export class ProductsModule {}
