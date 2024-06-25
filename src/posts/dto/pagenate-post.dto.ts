// import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  // @Type(() => Number)
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsIn(['ASC'])
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  order__createdAt?: 'ASC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
