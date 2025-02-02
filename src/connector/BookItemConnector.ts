import { type AxiosRequestConfig } from 'axios';
import { BookItem, type IBookItem } from '../model/BookItem';
import { type IPage, type IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class BookItemConnector {

  async search(book: string, filter: IPagingFilter): Promise<Result<IPage<IBookItem>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IBookItem>>(`books/${book}/items`, axiosConfig);
  }

  async get(book: string, uuid: string): Promise<Result<IBookItem>> {
    return await catalogConnector.get<IBookItem>(`books/${book}/items/${uuid}`);
  }

  async add(book: string, request: BookItem): Promise<Result<IBookItem>> {
    return await catalogConnector.post<IBookItem>(`books/${book}/items`, request);
  }

  async update(book: string, uuid: string, request: BookItem): Promise<Result<IBookItem>> {
    return await catalogConnector.put<IBookItem>(`books/${book}/items/${uuid}`, request);
  }

  async remove(book: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`books/${book}/items/${uuid}`);
  }

  async duplicate(book: string, uuid: string): Promise<Result<IBookItem>> {
    return await catalogConnector.post<IBookItem>(`books/${book}/items/${uuid}/duplicate`);
  }

}

export default new BookItemConnector();
