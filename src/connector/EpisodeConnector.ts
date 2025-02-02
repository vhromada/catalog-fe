import { type AxiosRequestConfig } from 'axios';
import { type IPage, type IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { ChangeEpisodeRequest, type IEpisode } from '../model/Episode';
import { catalogConnector } from './common/CatalogConnector.ts';

export class EpisodeConnector {

  async search(show: string, season: string, filter: IPagingFilter): Promise<Result<IPage<IEpisode>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IEpisode>>(`shows/${show}/seasons/${season}/episodes`, axiosConfig);
  }

  async get(show: string, season: string, uuid: string): Promise<Result<IEpisode>> {
    return await catalogConnector.get<IEpisode>(`shows/${show}/seasons/${season}/episodes/${uuid}`);
  }

  async add(show: string, season: string, request: ChangeEpisodeRequest): Promise<Result<IEpisode>> {
    return await catalogConnector.post<IEpisode>(`shows/${show}/seasons/${season}/episodes`, request);
  }

  async update(show: string, season: string, uuid: string, request: ChangeEpisodeRequest): Promise<Result<IEpisode>> {
    return await catalogConnector.put<IEpisode>(`shows/${show}/seasons/${season}/episodes/${uuid}`, request);
  }

  async remove(show: string, season: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`shows/${show}/seasons/${season}/episodes/${uuid}`);
  }

  async duplicate(show: string, season: string, uuid: string): Promise<Result<IEpisode>> {
    return await catalogConnector.post<IEpisode>(`shows/${show}/seasons/${season}/episodes/${uuid}/duplicate`);
  }

}

export default new EpisodeConnector();
