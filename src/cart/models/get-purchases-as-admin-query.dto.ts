import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetPurchasesAsAdminDTO {
  @IsInt({ message: 'PAGE_MUST_BE_INTEGER' })
  @IsOptional()
  @Type(() => Number)
  page = 1;
}
