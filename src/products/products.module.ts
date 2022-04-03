import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './controllers/items/items.controller';
import { Category } from './models/categories.entity';
import { Item } from './models/item.entity';
import { ItemsService } from './services/items/items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ProductsModule {}
