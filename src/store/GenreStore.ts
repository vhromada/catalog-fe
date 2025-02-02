import { ref, type Ref } from 'vue';
import genreConnector from '../connector/GenreConnector.ts';
import { type INameFilter, NameFilter } from '../model/common/Filter.ts';
import { type IPagingInfo } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { Genre, type IGenre, type IGenreStatistics } from '../model/Genre.ts';
import config from '../utils/Config.ts';

export class GenreStore {

  genres: Ref<IGenre[]>;
  statistics: Ref<IGenreStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: NameFilter;

  constructor() {
    this.genres = ref([]);
    this.statistics = ref({} as IGenreStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new NameFilter();
  }

  async load(): Promise<IResult> {
    const genresResponse = await this.searchByFilter(this.filter);
    if (genresResponse.isOk()) {
      const statisticsResponse = await genreConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return genresResponse;
    }
  }

  async getAll(): Promise<IResult> {
    const filter = new NameFilter();
    filter.page = 1;
    filter.limit = config.allDataCount;
    return await this.searchByFilter(filter);
  }

  async search(name: string): Promise<IResult> {
    this.filter.updateName(name);
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

  async get(uuid: string): Promise<Result<IGenre>> {
    return await genreConnector.get(uuid);
  }

  async add(request: Genre): Promise<IResult> {
    return await genreConnector.add(request);
  }

  async update(uuid: string, request: Genre): Promise<IResult> {
    return await genreConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await genreConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await genreConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.genres.value.length > 0;
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

  private async searchByFilter(filter: INameFilter): Promise<IResult> {
    const response = await genreConnector.search(filter);
    if (response.isOk()) {
      this.genres.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
