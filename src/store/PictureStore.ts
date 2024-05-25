import { Ref, ref } from 'vue';
import pictureConnector from '../connector/PictureConnector.ts';
import { IPagingFilter, IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { IResult } from '../model/common/Result.ts';
import config from '../utils/Config.ts';

export class PictureStore {

  pictures: Ref<string[]>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.pictures = ref([]);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(): Promise<IResult> {
    return this.searchByFilter(this.filter);
  }

  async getAll(): Promise<IResult> {
    const filter = new PagingFilter();
    filter.page = 1;
    filter.limit = config.allDataCount;
    return await this.searchByFilter(filter);
  }

  async first(): Promise<IResult> {
    this.filter.page = 1;
    return await this.searchByFilter(this.filter);
  }

  async previous(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.searchByFilter(this.filter);
  }

  async next(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.searchByFilter(this.filter);
  }

  async last(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.searchByFilter(this.filter);
  }

  async add(request: File): Promise<IResult> {
    return await pictureConnector.add(request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await pictureConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.pictures.value.length > 0;
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

  private async searchByFilter(filter: IPagingFilter): Promise<IResult> {
    const response = await pictureConnector.search(filter);
    if (response.isOk()) {
      this.pictures.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
