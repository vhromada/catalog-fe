import { AxiosRequestConfig } from 'axios';
import { IMultipleNameFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { ChangeMovieRequest, IMovie, IMovieStatistics } from '../model/Movie';
import { catalogConnector } from './common/CatalogConnector.ts';

export class MovieConnector {

  async search(filter: IMultipleNameFilter): Promise<Result<IPage<IMovie>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IMovie>>('movies', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IMovie>> {
    return await catalogConnector.get<IMovie>(`movies/${uuid}`);
  }

  async add(request: ChangeMovieRequest): Promise<Result<IMovie>> {
    return await catalogConnector.post<IMovie>('movies', request);
  }

  async update(uuid: string, request: ChangeMovieRequest): Promise<Result<IMovie>> {
    return await catalogConnector.put<IMovie>(`movies/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`movies/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IMovie>> {
    return await catalogConnector.post<IMovie>(`movies/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IMovieStatistics>> {
    return await catalogConnector.get<IMovieStatistics>('movies/statistics');
  }

}

export default new MovieConnector();
