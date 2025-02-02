import { type AxiosRequestConfig } from 'axios';
import { type INameFilter } from '../model/common/Filter.ts';
import { type IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { Genre, type IGenre, type IGenreStatistics } from '../model/Genre';
import { catalogConnector } from './common/CatalogConnector.ts';

export class GenreConnector {

  async search(filter: INameFilter): Promise<Result<IPage<IGenre>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IGenre>>('genres', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IGenre>> {
    return await catalogConnector.get<IGenre>(`genres/${uuid}`);
  }

  async add(request: Genre): Promise<Result<IGenre>> {
    return await catalogConnector.post<IGenre>('genres', request);
  }

  async update(uuid: string, request: Genre): Promise<Result<IGenre>> {
    return await catalogConnector.put<IGenre>(`genres/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`genres/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IGenre>> {
    return await catalogConnector.post<IGenre>(`genres/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IGenreStatistics>> {
    return await catalogConnector.get<IGenreStatistics>('genres/statistics');
  }

}

export default new GenreConnector();
