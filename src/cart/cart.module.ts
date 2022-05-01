import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { CartController } from './controllers/cart/cart.controller';
import { CartItem } from './models/cart-item.entity';
import { CartOffer } from './models/cart-offer.entity';
import { Cart } from './models/cart.entity';
import { CartService } from './services/cart/cart.service';
import { PurchasesController } from './controllers/purchases/purchases/purchases.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, CartOffer]),
    ProductsModule,
  ],
  controllers: [CartController, PurchasesController],
  providers: [CartService],
})
export class CartModule {}
