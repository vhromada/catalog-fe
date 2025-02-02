import { ref, type Ref } from 'vue';
import episodeConnector from '../connector/EpisodeConnector.ts';
import { type IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { ChangeEpisodeRequest, type IEpisode } from '../model/Episode.ts';

export class EpisodeStore {

  episodes: Ref<IEpisode[]>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.episodes = ref([]);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(show: string, season: string): Promise<IResult> {
    const response = await episodeConnector.search(show, season, this.filter);
    if (response.isOk()) {
      this.episodes.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

  async first(show: string, season: string): Promise<IResult> {
    this.filter.page = 1;
    return await this.load(show, season);
  }

  async previous(show: string, season: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.load(show, season);
  }

  async next(show: string, season: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.load(show, season);
  }

  async last(show: string, season: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.load(show, season);
  }

  async get(show: string, season: string, uuid: string): Promise<Result<IEpisode>> {
    return await episodeConnector.get(show, season, uuid);
  }

  async add(show: string, season: string, request: ChangeEpisodeRequest): Promise<IResult> {
    return await episodeConnector.add(show, season, request);
  }

  async update(show: string, season: string, uuid: string, request: ChangeEpisodeRequest): Promise<IResult> {
    return await episodeConnector.update(show, season, uuid, request);
  }

  async remove(show: string, season: string, uuid: string): Promise<IResult> {
    const response = await episodeConnector.remove(show, season, uuid);
    if (response.isOk()) {
      return await this.load(show, season);
    } else {
      return response;
    }
  }

  async duplicate(show: string, season: string, uuid: string): Promise<IResult> {
    const response = await episodeConnector.duplicate(show, season, uuid);
    if (response.isOk()) {
      return await this.load(show, season);
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.episodes.value.length > 0;
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
