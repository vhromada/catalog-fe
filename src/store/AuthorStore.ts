import { Ref, ref } from 'vue';
import authorConnector from '../connector/AuthorConnector.ts';
import { Author, IAuthor, IAuthorStatistics } from '../model/Author.ts';
import { AuthorFilter, IAuthorFilter } from '../model/common/Filter.ts';
import { IPagingInfo } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import config from '../utils/Config.ts';

export class AuthorStore {

  authors: Ref<IAuthor[]>;
  statistics: Ref<IAuthorStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: AuthorFilter;

  constructor() {
    this.authors = ref([]);
    this.statistics = ref({} as IAuthorStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new AuthorFilter();
  }

  async load(): Promise<IResult> {
    const authorsResponse = await this.searchByFilter(this.filter);
    if (authorsResponse.isOk()) {
      const statisticsResponse = await authorConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!!;
      }
      return statisticsResponse;
    } else {
      return authorsResponse;
    }
  }

  async getAll(): Promise<IResult> {
    const filter = new AuthorFilter();
    filter.page = 1;
    filter.limit = config.allDataCount;
    return await this.searchByFilter(filter);
  }

  async search(firstName: string, middleName: string, lastName: string): Promise<IResult> {
    this.filter.updateFirstName(firstName);
    this.filter.updateMiddleName(middleName);
    this.filter.updateLastName(lastName);
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

  async get(uuid: string): Promise<Result<IAuthor>> {
    return await authorConnector.get(uuid);
  }

  async add(request: Author): Promise<IResult> {
    return await authorConnector.add(request);
  }

  async update(uuid: string, request: Author): Promise<IResult> {
    return await authorConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await authorConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await authorConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.authors.value.length > 0;
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

  private async searchByFilter(filter: IAuthorFilter): Promise<IResult> {
    const response = await authorConnector.search(filter);
    if (response.isOk()) {
      this.authors.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
