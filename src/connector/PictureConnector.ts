import { type AxiosRequestConfig } from 'axios';
import { type IPage, type IPagingFilter } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class PictureConnector {

  async search(filter: IPagingFilter): Promise<Result<IPage<string>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<string>>('pictures', axiosConfig);
  }

  async add(picture: File): Promise<Result<void>> {
    const axiosConfig: AxiosRequestConfig = {
      headers: {'Content-Type': 'multipart/form-data'}
    };
    const data = new FormData();
    data.append('file', picture);
    return await catalogConnector.post<void>('pictures', data, axiosConfig);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`pictures/${uuid}`);
  }

}

export default new PictureConnector();
