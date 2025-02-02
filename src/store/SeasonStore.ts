import { ref, type Ref } from 'vue';
import seasonConnector from '../connector/SeasonConnector.ts';
import { type IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { type ISeason, Season } from '../model/Season.ts';

export class SeasonStore {

  seasons: Ref<ISeason[]>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.seasons = ref([]);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(show: string): Promise<IResult> {
    const response = await seasonConnector.search(show, this.filter);
    if (response.isOk()) {
      this.seasons.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

  async first(show: string): Promise<IResult> {
    this.filter.page = 1;
    return await this.load(show);
  }

  async previous(show: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.load(show);
  }

  async next(show: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.load(show);
  }

  async last(show: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.load(show);
  }

  async get(show: string, uuid: string): Promise<Result<ISeason>> {
    return await seasonConnector.get(show, uuid);
  }

  async add(show: string, request: Season): Promise<IResult> {
    return await seasonConnector.add(show, request);
  }

  async update(show: string, uuid: string, request: Season): Promise<IResult> {
    return await seasonConnector.update(show, uuid, request);
  }

  async remove(show: string, uuid: string): Promise<IResult> {
    const response = await seasonConnector.remove(show, uuid);
    if (response.isOk()) {
      return await this.load(show);
    } else {
      return response;
    }
  }

  async duplicate(show: string, uuid: string): Promise<IResult> {
    const response = await seasonConnector.duplicate(show, uuid);
    if (response.isOk()) {
      return await this.load(show);
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.seasons.value.length > 0;
  }

  isPagingAllowed(): boolean {
    return this.pagingInfo.pagesCount > 1;
  }

  canPrevious(): boolean {
    return this.pagingInfo.pageNumber > 1;
  }

  canNext(): boolean {
    return this.pagingInfo.pageNumber < this.pagingInfo.pagesCount;
  }

  getPage(): string {
    return `${this.pagingInfo.pageNumber} / ${this.pagingInfo.pagesCount}`;
  }

}
