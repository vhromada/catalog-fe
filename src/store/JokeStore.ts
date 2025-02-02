import { ref, type Ref } from 'vue';
import jokeConnector from '../connector/JokeConnector.ts';
import { type IPagingFilter, type IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { type IJoke, type IJokeStatistics, Joke } from '../model/Joke.ts';

export class JokeStore {

  jokes: Ref<IJoke[]>;
  statistics: Ref<IJokeStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.jokes = ref([]);
    this.statistics = ref({} as IJokeStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(): Promise<IResult> {
    const jokesResponse = await this.searchByFilter(this.filter);
    if (jokesResponse.isOk()) {
      const statisticsResponse = await jokeConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return jokesResponse;
    }
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

  async get(uuid: string): Promise<Result<IJoke>> {
    return await jokeConnector.get(uuid);
  }

  async add(request: Joke): Promise<IResult> {
    return await jokeConnector.add(request);
  }

  async update(uuid: string, request: Joke): Promise<IResult> {
    return await jokeConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await jokeConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.jokes.value.length > 0;
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
    const response = await jokeConnector.search(filter);
    if (response.isOk()) {
      this.jokes.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
