import { ref, Ref } from 'vue';
import showConnector from '../connector/ShowConnector.ts';
import { IMultipleNameFilter, MultipleNameFilter } from '../model/common/Filter.ts';
import { IPagingInfo } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import { ChangeShowRequest, IShow, IShowStatistics } from '../model/Show.ts';

export class ShowStore {

  shows: Ref<IShow[]>;
  statistics: Ref<IShowStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: MultipleNameFilter;

  constructor() {
    this.shows = ref([]);
    this.statistics = ref({} as IShowStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new MultipleNameFilter();
  }

  async load(): Promise<IResult> {
    const showsResponse = await this.searchByFilter(this.filter);
    if (showsResponse.isOk()) {
      const statisticsResponse = await showConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!!;
      }
      return statisticsResponse;
    } else {
      return showsResponse;
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

  async get(uuid: string): Promise<Result<IShow>> {
    return await showConnector.get(uuid);
  }

  async add(request: ChangeShowRequest): Promise<IResult> {
    return await showConnector.add(request);
  }

  async update(uuid: string, request: ChangeShowRequest): Promise<IResult> {
    return await showConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await showConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await showConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.shows.value.length > 0;
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
    const response = await showConnector.search(filter);
    if (response.isOk()) {
      this.shows.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
