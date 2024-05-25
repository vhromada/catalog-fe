import { Ref, ref } from 'vue';
import songConnector from '../connector/SongConnector.ts';
import { IPagingInfo, PagingFilter } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import { ChangeSongRequest, ISong } from '../model/Song.ts';

export class SongStore {

  songs: Ref<ISong[]>;
  private pagingInfo: IPagingInfo;
  private readonly filter: PagingFilter;

  constructor() {
    this.songs = ref([]);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new PagingFilter();
  }

  async load(music: string): Promise<IResult> {
    const response = await songConnector.search(music, this.filter);
    if (response.isOk()) {
      this.songs.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

  async first(music: string): Promise<IResult> {
    this.filter.page = 1;
    return await this.load(music);
  }

  async previous(music: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.load(music);
  }

  async next(music: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.load(music);
  }

  async last(music: string): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.load(music);
  }

  async get(music: string, uuid: string): Promise<Result<ISong>> {
    return await songConnector.get(music, uuid);
  }

  async add(music: string, request: ChangeSongRequest): Promise<IResult> {
    return await songConnector.add(music, request);
  }

  async update(music: string, uuid: string, request: ChangeSongRequest): Promise<IResult> {
    return await songConnector.update(music, uuid, request);
  }

  async remove(music: string, uuid: string): Promise<IResult> {
    const response = await songConnector.remove(music, uuid);
    if (response.isOk()) {
      return await this.load(music);
    } else {
      return response;
    }
  }

  async duplicate(music: string, uuid: string): Promise<IResult> {
    const response = await songConnector.duplicate(music, uuid);
    if (response.isOk()) {
      return await this.load(music);
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.songs.value.length > 0;
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
