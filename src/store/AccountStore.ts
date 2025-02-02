import { ref, type Ref } from 'vue';
import accountConnector from '../connector/AccountConnector.ts';
import { Credentials, type IAccount, type IAccountStatistics } from '../model/Account.ts';
import { AccountFilter, type IAccountFilter } from '../model/common/Filter.ts';
import { type IPagingInfo } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';

export class AccountStore {

  accounts: Ref<IAccount[]>;
  statistics: Ref<IAccountStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: AccountFilter;

  constructor() {
    this.accounts = ref([]);
    this.statistics = ref({} as IAccountStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new AccountFilter();
  }

  async load(): Promise<IResult> {
    const accountsResponse = await this.searchByFilter(this.filter);
    if (accountsResponse.isOk()) {
      const statisticsResponse = await accountConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return accountsResponse;
    }
  }

  async search(username: string): Promise<IResult> {
    this.filter.updateUsername(username);
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

  async get(uuid: string): Promise<Result<IAccount>> {
    return await accountConnector.get(uuid);
  }

  async addCredentials(credentials: Credentials): Promise<Result<IAccount>> {
    return await accountConnector.addCredentials(credentials);
  }

  exists(): boolean {
    return this.accounts.value.length > 0;
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

  private async searchByFilter(filter: IAccountFilter): Promise<IResult> {
    const response = await accountConnector.search(filter);
    if (response.isOk()) {
      this.accounts.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
