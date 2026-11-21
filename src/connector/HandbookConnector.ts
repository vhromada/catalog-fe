import { Result } from '../model/common/Result.ts';
import { type IHandbook, Handbook } from '../model/Handbook.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class HandbookConnector {

  async find(game: string): Promise<Result<IHandbook>> {
    return await catalogConnector.get<IHandbook>(`games/${game}/handbooks`);
  }

  async get(game: string, uuid: string): Promise<Result<IHandbook>> {
    return await catalogConnector.get<IHandbook>(`games/${game}/handbooks/${uuid}`);
  }

  async add(game: string, request: Handbook): Promise<Result<IHandbook>> {
    return await catalogConnector.post<IHandbook>(`games/${game}/handbooks`, request);
  }

  async update(game: string, uuid: string, request: Handbook): Promise<Result<IHandbook>> {
    return await catalogConnector.put<IHandbook>(`games/${game}/handbooks/${uuid}`, request);
  }

  async remove(game: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`games/${game}/handbooks/${uuid}`);
  }

}

export default new HandbookConnector();
