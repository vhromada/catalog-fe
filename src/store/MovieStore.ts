import { ref, Ref } from 'vue';
import movieConnector from '../connector/MovieConnector.ts';
import { IMultipleNameFilter, MultipleNameFilter } from '../model/common/Filter.ts';
import { IPagingInfo } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import { ChangeMovieRequest, IMovie, IMovieStatistics } from '../model/Movie.ts';

export class MovieStore {

  movies: Ref<IMovie[]>;
  statistics: Ref<IMovieStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: MultipleNameFilter;

  constructor() {
    this.movies = ref([]);
    this.statistics = ref({} as IMovieStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new MultipleNameFilter();
  }

  async load(): Promise<IResult> {
    const moviesResponse = await this.searchByFilter(this.filter);
    if (moviesResponse.isOk()) {
      const statisticsResponse = await movieConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!!;
      }
      return statisticsResponse;
    } else {
      return moviesResponse;
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

  async get(uuid: string): Promise<Result<IMovie>> {
    return await movieConnector.get(uuid);
  }

  async add(request: ChangeMovieRequest): Promise<IResult> {
    return await movieConnector.add(request);
  }

  async update(uuid: string, request: ChangeMovieRequest): Promise<IResult> {
    return await movieConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await movieConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await movieConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.movies.value.length > 0;
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
    const response = await movieConnector.search(filter);
    if (response.isOk()) {
      this.movies.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
