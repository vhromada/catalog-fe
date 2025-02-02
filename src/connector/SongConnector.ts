import { type AxiosRequestConfig } from 'axios';
import { type IPage, type IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { ChangeSongRequest, type ISong } from '../model/Song';
import { catalogConnector } from './common/CatalogConnector.ts';

export class SongConnector {

  async search(music: string, filter: IPagingFilter): Promise<Result<IPage<ISong>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<ISong>>(`music/${music}/songs`, axiosConfig);
  }

  async get(music: string, uuid: string): Promise<Result<ISong>> {
    return await catalogConnector.get<ISong>(`music/${music}/songs/${uuid}`);
  }

  async add(music: string, request: ChangeSongRequest): Promise<Result<ISong>> {
    return await catalogConnector.post<ISong>(`music/${music}/songs`, request);
  }

  async update(music: string, uuid: string, request: ChangeSongRequest): Promise<Result<ISong>> {
    return await catalogConnector.put<ISong>(`music/${music}/songs/${uuid}`, request);
  }

  async remove(music: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`music/${music}/songs/${uuid}`);
  }

  async duplicate(music: string, uuid: string): Promise<Result<ISong>> {
    return await catalogConnector.post<ISong>(`music/${music}/songs/${uuid}/duplicate`);
  }

}

export default new SongConnector();
