import { ref, type Ref } from 'vue';
import musicConnector from '../connector/MusicConnector.ts';
import { type INameFilter, NameFilter } from '../model/common/Filter.ts';
import { type IPagingInfo } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { type IMusic, type IMusicStatistics, Music } from '../model/Music.ts';

export class MusicStore {

  musicList: Ref<IMusic[]>;
  statistics: Ref<IMusicStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: NameFilter;

  constructor() {
    this.musicList = ref([]);
    this.statistics = ref({} as IMusicStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new NameFilter();
  }

  async load(): Promise<IResult> {
    const musicListResponse = await this.searchByFilter(this.filter);
    if (musicListResponse.isOk()) {
      const statisticsResponse = await musicConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return musicListResponse;
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

  async get(uuid: string): Promise<Result<IMusic>> {
    return await musicConnector.get(uuid);
  }

  async add(request: Music): Promise<IResult> {
    return await musicConnector.add(request);
  }

  async update(uuid: string, request: Music): Promise<IResult> {
    return await musicConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await musicConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await musicConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.musicList.value.length > 0;
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
    const response = await musicConnector.search(filter);
    if (response.isOk()) {
      this.musicList.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
