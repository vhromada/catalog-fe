import { Ref, ref } from 'vue';
import gameConnector from '../connector/GameConnector.ts';
import { INameFilter, NameFilter } from '../model/common/Filter.ts';
import { IPagingInfo } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import { Game, IGame, IGameStatistics } from '../model/Game.ts';

export class GameStore {

  games: Ref<IGame[]>;
  statistics: Ref<IGameStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: NameFilter;

  constructor() {
    this.games = ref([]);
    this.statistics = ref({} as IGameStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new NameFilter();
  }

  async load(): Promise<IResult> {
    const gamesResponse = await this.searchByFilter(this.filter);
    if (gamesResponse.isOk()) {
      const statisticsResponse = await gameConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!!;
      }
      return statisticsResponse;
    } else {
      return gamesResponse;
    }
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

  async get(uuid: string): Promise<Result<IGame>> {
    return await gameConnector.get(uuid);
  }

  async add(request: Game): Promise<IResult> {
    return await gameConnector.add(request);
  }

  async update(uuid: string, request: Game): Promise<IResult> {
    return await gameConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await gameConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await gameConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.games.value.length > 0;
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
    const response = await gameConnector.search(filter);
    if (response.isOk()) {
      this.games.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
