import { type AxiosRequestConfig } from 'axios';
import { ChangeBookRequest, type IBook, type IBookStatistics } from '../model/Book';
import { type IMultipleNameFilter } from '../model/common/Filter.ts';
import { type IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class BookConnector {

  async search(filter: IMultipleNameFilter): Promise<Result<IPage<IBook>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IBook>>('books', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IBook>> {
    return await catalogConnector.get<IBook>(`books/${uuid}`);
  }

  async add(request: ChangeBookRequest): Promise<Result<IBook>> {
    return await catalogConnector.post<IBook>('books', request);
  }

  async update(uuid: string, request: ChangeBookRequest): Promise<Result<IBook>> {
    return await catalogConnector.put<IBook>(`books/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`books/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IBook>> {
    return await catalogConnector.post<IBook>(`books/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IBookStatistics>> {
    return await catalogConnector.get<IBookStatistics>('books/statistics');
  }

}

export default new BookConnector();
