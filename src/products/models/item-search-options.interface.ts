import { DirectionENUM } from './direction.enum';
import { OrderByEnum } from './order-by.enum';

export interface ItemSearchOptions {
  categoryId?: number;
  orderBy?: OrderByEnum;
  direction?: DirectionENUM;
  searchProductString?: string;
}
