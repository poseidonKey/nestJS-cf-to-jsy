import { Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { BaseModel } from './entity/base.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    ovrrideFindOptions: FindManyOptions<T>,
    path: string, // posts, user 등을 위해
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, ovrrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, ovrrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    ovrrideFindOptions: FindManyOptions<T>,
  ) {}

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    ovrrideFindOptions: FindManyOptions<T>,
    path: string,
  ) {
    /**
     * where__likeCount__more_than
     *
     * where__title__ilike
     */
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * where
     * order
     * take
     * skip -> page 기반일 때만
     * 위와 같은 항목들을 반환한다.
     *
     *
     *
     * * DTO의 현재 구조는
     * {
     *  where__id__more_than
     * order__createdAt: 'ASC'
     * 또 여러개가 올 수도 있다.
     *
     * likeCount 나 title__ilike 등도 추가해야 한다.
     *
     * }
     * 1. where로 시작한다면 필터 로직을 적용
     * 2. order로 시작한다면 정렬 로직 적용
     * 3. 필터 로직 적용한다면 '__' 기준으로 split 했을 때 3개의 값으로 나뉘는지, 2개 값으로
     *    나뉘는지 확인
     *  3-1. 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당되는 operator 함수를 찾아 적용
     *      ['where', 'id', 'more_than]
     *  3-2. 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에 operator 없이 적용
     *      ['where', 'id']
     * 4. order의 경우는 3-2와 같이 적용
     */

    return;
  }
}
