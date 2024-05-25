import { Ref, ref } from 'vue';
import programConnector from '../connector/ProgramConnector.ts';
import { INameFilter, NameFilter } from '../model/common/Filter.ts';
import { IPagingInfo } from '../model/common/Paging.ts';
import { IResult, Result } from '../model/common/Result.ts';
import { IProgram, IProgramStatistics, Program } from '../model/Program.ts';

export class ProgramStore {

  programs: Ref<IProgram[]>;
  statistics: Ref<IProgramStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: NameFilter;

  constructor() {
    this.programs = ref([]);
    this.statistics = ref({} as IProgramStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new NameFilter();
  }

  async load(): Promise<IResult> {
    const programsResponse = await this.searchByFilter(this.filter);
    if (programsResponse.isOk()) {
      const statisticsResponse = await programConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!!;
      }
      return statisticsResponse;
    } else {
      return programsResponse;
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

  async get(uuid: string): Promise<Result<IProgram>> {
    return await programConnector.get(uuid);
  }

  async add(request: Program): Promise<IResult> {
    return await programConnector.add(request);
  }

  async update(uuid: string, request: Program): Promise<IResult> {
    return await programConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await programConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await programConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.programs.value.length > 0;
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
    const response = await programConnector.search(filter);
    if (response.isOk()) {
      this.programs.value = response.data!!.data!!;
      this.pagingInfo = response.data!!.pagingInfo!!;
    }
    return response;
  }

}
