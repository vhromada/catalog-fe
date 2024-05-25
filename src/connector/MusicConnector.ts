import { AxiosRequestConfig } from 'axios';
import { INameFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { IMusic, IMusicStatistics, Music } from '../model/Music';
import { catalogConnector } from './common/CatalogConnector.ts';

export class MusicConnector {

  async search(filter: INameFilter): Promise<Result<IPage<IMusic>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IMusic>>('music', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IMusic>> {
    return await catalogConnector.get<IMusic>(`music/${uuid}`);
  }

  async add(request: Music): Promise<Result<IMusic>> {
    return await catalogConnector.post<IMusic>('music', request);
  }

  async update(uuid: string, request: Music): Promise<Result<IMusic>> {
    return await catalogConnector.put<IMusic>(`music/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`music/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IMusic>> {
    return await catalogConnector.post<IMusic>(`music/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IMusicStatistics>> {
    return await catalogConnector.get<IMusicStatistics>('music/statistics');
  }

}

export default new MusicConnector();
