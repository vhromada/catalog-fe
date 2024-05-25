import { AxiosRequestConfig } from 'axios';
import { hashSync } from 'bcrypt-ts';
import { ChangeRoles, Credentials, IAccount, IAccountStatistics } from '../model/Account';
import { IAccountFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import config from '../utils/Config.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class AccountConnector {

  async search(filter: IAccountFilter): Promise<Result<IPage<IAccount>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IAccount>>('accounts', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IAccount>> {
    return await catalogConnector.get<IAccount>(`accounts/${uuid}`);
  }

  async updateCredentials(uuid: string, credentials: Credentials): Promise<Result<IAccount>> {
    credentials.password = this.hashPassword(credentials.password);
    return await catalogConnector.put<IAccount>(`accounts/${uuid}/credentials`, credentials, {}, true);
  }

  async updateRoles(uuid: string, request: ChangeRoles): Promise<Result<IAccount>> {
    return await catalogConnector.put<IAccount>(`accounts/${uuid}/roles`, request);
  }

  async getStatistics(): Promise<Result<IAccountStatistics>> {
    return await catalogConnector.get<IAccountStatistics>('accounts/statistics');
  }

  async addCredentials(credentials: Credentials): Promise<Result<IAccount>> {
    credentials.password = this.hashPassword(credentials.password);
    return await catalogConnector.post<IAccount>('accounts/credentials', credentials, {}, true);
  }

  async checkCredentials(credentials: Credentials): Promise<Result<IAccount>> {
    credentials.password = this.hashPassword(credentials.password);
    return await catalogConnector.post<IAccount>('accounts/credentials/check', credentials, {}, true);
  }

  private hashPassword(password: string): string {
    return hashSync(password, config.hashSalt);
  }

}

export default new AccountConnector();
