import { AxiosRequestConfig } from 'axios';
import { IMultipleNameFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { ChangeShowRequest, IShow, IShowStatistics } from '../model/Show';
import { catalogConnector } from './common/CatalogConnector.ts';

export class ShowConnector {

  async search(filter: IMultipleNameFilter): Promise<Result<IPage<IShow>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IShow>>('shows', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IShow>> {
    return await catalogConnector.get<IShow>(`shows/${uuid}`);
  }

  async add(request: ChangeShowRequest): Promise<Result<IShow>> {
    return await catalogConnector.post<IShow>('shows', request);
  }

  async update(uuid: string, request: ChangeShowRequest): Promise<Result<IShow>> {
    return await catalogConnector.put<IShow>(`shows/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`shows/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IShow>> {
    return await catalogConnector.post<IShow>(`shows/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IShowStatistics>> {
    return await catalogConnector.get<IShowStatistics>('shows/statistics');
  }

}

export default new ShowConnector();
