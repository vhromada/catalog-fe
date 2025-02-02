import { type AxiosRequestConfig } from 'axios';
import { type IPage, type IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { type IJoke, type IJokeStatistics, Joke } from '../model/Joke';
import { catalogConnector } from './common/CatalogConnector.ts';

export class JokeConnector {

  async search(filter: IPagingFilter): Promise<Result<IPage<IJoke>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IJoke>>('jokes', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IJoke>> {
    return await catalogConnector.get<IJoke>(`jokes/${uuid}`);
  }

  async add(request: Joke): Promise<Result<IJoke>> {
    return await catalogConnector.post<IJoke>('jokes', request);
  }

  async update(uuid: string, request: Joke): Promise<Result<IJoke>> {
    return await catalogConnector.put<IJoke>(`jokes/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`jokes/${uuid}`);
  }

  async getStatistics(): Promise<Result<IJokeStatistics>> {
    return await catalogConnector.get<IJokeStatistics>('jokes/statistics');
  }

}

export default new JokeConnector();
