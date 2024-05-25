import config from '../../utils/Config.ts';
import SearchParams from '../../utils/SearchParams.ts';

export interface IPagingFilter {

  page?: number;
  limit?: number;

  toSearchParams(): SearchParams;

}

export class PagingFilter implements IPagingFilter {

  page?: number;
  limit?: number;

  constructor() {
    this.limit = config.itemsPerPage;
  }

  toSearchParams(): SearchParams {
    return new SearchParams()
      .add('page', this.page)
      .add('limit', this.limit);
  }

}

export interface IPagingInfo {
  pageNumber: number,
  pagesCount: number
}

export interface IPage<T> {
  data?: T[];
  pagingInfo?: IPagingInfo;
}
