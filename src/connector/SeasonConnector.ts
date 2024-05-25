import { AxiosRequestConfig } from 'axios';
import { IPage, IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { ISeason, Season } from '../model/Season';
import { catalogConnector } from './common/CatalogConnector.ts';

export class SeasonConnector {

  async search(show: string, filter: IPagingFilter): Promise<Result<IPage<ISeason>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<ISeason>>(`shows/${show}/seasons`, axiosConfig);
  }

  async get(show: string, uuid: string): Promise<Result<ISeason>> {
    return await catalogConnector.get<ISeason>(`shows/${show}/seasons/${uuid}`);
  }

  async add(show: string, request: Season): Promise<Result<ISeason>> {
    return await catalogConnector.post<ISeason>(`shows/${show}/seasons`, request);
  }

  async update(show: string, uuid: string, request: Season): Promise<Result<ISeason>> {
    return await catalogConnector.put<ISeason>(`shows/${show}/seasons/${uuid}`, request);
  }

  async remove(show: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`shows/${show}/seasons/${uuid}`);
  }

  async duplicate(show: string, uuid: string): Promise<Result<ISeason>> {
    return await catalogConnector.post<ISeason>(`shows/${show}/seasons/${uuid}/duplicate`);
  }

}

export default new SeasonConnector();
