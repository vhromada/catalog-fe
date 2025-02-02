import { ref, type Ref } from 'vue';
import bookConnector from '../connector/BookConnector.ts';
import { ChangeBookRequest, type IBook, type IBookStatistics } from '../model/Book.ts';
import { type IMultipleNameFilter, MultipleNameFilter } from '../model/common/Filter.ts';
import { type IPagingInfo } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';

export class BookStore {

  books: Ref<IBook[]>;
  statistics: Ref<IBookStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: MultipleNameFilter;

  constructor() {
    this.books = ref([]);
    this.statistics = ref({} as IBookStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new MultipleNameFilter();
  }

  async load(): Promise<IResult> {
    const booksResponse = await this.searchByFilter(this.filter);
    if (booksResponse.isOk()) {
      const statisticsResponse = await bookConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return booksResponse;
    }
  }

  async search(czechName: string, originalName: string): Promise<IResult> {
    this.filter.updateCzechName(czechName);
    this.filter.updateOriginalName(originalName);
    this.filter.page = 1;
    return await this.searchByFilter(this.filter);
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

  async get(uuid: string): Promise<Result<IBook>> {
    return await bookConnector.get(uuid);
  }

  async add(request: ChangeBookRequest): Promise<IResult> {
    return await bookConnector.add(request);
  }

  async update(uuid: string, request: ChangeBookRequest): Promise<IResult> {
    return await bookConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await bookConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await bookConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.books.value.length > 0;
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

  private async searchByFilter(filter: IMultipleNameFilter): Promise<IResult> {
    const response = await bookConnector.search(filter);
    if (response.isOk()) {
      this.books.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
