import { AxiosRequestConfig } from 'axios';
import { Author, IAuthor, IAuthorStatistics } from '../model/Author';
import { IAuthorFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class AuthorConnector {

  async search(filter: IAuthorFilter): Promise<Result<IPage<IAuthor>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IAuthor>>('authors', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IAuthor>> {
    return await catalogConnector.get<IAuthor>(`authors/${uuid}`);
  }

  async add(request: Author): Promise<Result<IAuthor>> {
    return await catalogConnector.post<IAuthor>('authors', request);
  }

  async update(uuid: string, request: Author): Promise<Result<IAuthor>> {
    return await catalogConnector.put<IAuthor>(`authors/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`authors/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IAuthor>> {
    return await catalogConnector.post<IAuthor>(`authors/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IAuthorStatistics>> {
    return await catalogConnector.get<IAuthorStatistics>('authors/statistics');
  }

}

export default new AuthorConnector();
