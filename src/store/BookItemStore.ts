import { Ref, ref } from 'vue';
import bookItemConnector from '../connector/BookItemConnector.ts';
import { BookItem, IBookItem } from '../model/BookItem.ts';
import { IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';

export class BookItemStore {

  bookItems: Ref<IBookItem[]>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.bookItems = ref([]);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(book: string): Promise<IResult> {
    const response = await bookItemConnector.search(book, this.filter);
    if (response.isOk()) {
      this.bookItems.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

  async first(book: string): Promise<IResult> {
    this.filter.page = 1;
    return await this.load(book);
  }

  async previous(book: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.load(book);
  }

  async next(book: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.load(book);
  }

  async last(book: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.load(book);
  }

  async get(book: string, uuid: string): Promise<Result<IBookItem>> {
    return await bookItemConnector.get(book, uuid);
  }

  async add(book: string, request: BookItem): Promise<IResult> {
    return await bookItemConnector.add(book, request);
  }

  async update(book: string, uuid: string, request: BookItem): Promise<IResult> {
    return await bookItemConnector.update(book, uuid, request);
  }

  async remove(book: string, uuid: string): Promise<IResult> {
    const response = await bookItemConnector.remove(book, uuid);
    if (response.isOk()) {
      return await this.load(book);
    } else {
      return response;
    }
  }

  async duplicate(book: string, uuid: string): Promise<IResult> {
    const response = await bookItemConnector.duplicate(book, uuid);
    if (response.isOk()) {
      return await this.load(book);
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.bookItems.value.length > 0;
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
