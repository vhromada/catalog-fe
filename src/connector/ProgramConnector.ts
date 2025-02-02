import { type AxiosRequestConfig } from 'axios';
import { type INameFilter } from '../model/common/Filter.ts';
import { type IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { type IProgram, type IProgramStatistics, Program } from '../model/Program';
import { catalogConnector } from './common/CatalogConnector.ts';

export class ProgramConnector {

  async search(filter: INameFilter): Promise<Result<IPage<IProgram>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IProgram>>('programs', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IProgram>> {
    return await catalogConnector.get<IProgram>(`programs/${uuid}`);
  }

  async add(request: Program): Promise<Result<IProgram>> {
    return await catalogConnector.post<IProgram>('programs', request);
  }

  async update(uuid: string, request: Program): Promise<Result<IProgram>> {
    return await catalogConnector.put<IProgram>(`programs/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`programs/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IProgram>> {
    return await catalogConnector.post<IProgram>(`programs/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IProgramStatistics>> {
    return await catalogConnector.get<IProgramStatistics>('programs/statistics');
  }

}

export default new ProgramConnector();
