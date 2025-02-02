import { ChangeCheatRequest, type ICheat } from '../model/Cheat';
import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class CheatConnector {

  async find(game: string): Promise<Result<ICheat>> {
    return await catalogConnector.get<ICheat>(`games/${game}/cheats`);
  }

  async get(game: string, uuid: string): Promise<Result<ICheat>> {
    return await catalogConnector.get<ICheat>(`games/${game}/cheats/${uuid}`);
  }

  async add(game: string, request: ChangeCheatRequest): Promise<Result<ICheat>> {
    return await catalogConnector.post<ICheat>(`games/${game}/cheats`, request);
  }

  async update(game: string, uuid: string, request: ChangeCheatRequest): Promise<Result<ICheat>> {
    return await catalogConnector.put<ICheat>(`games/${game}/cheats/${uuid}`, request);
  }

  async remove(game: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`games/${game}/cheats/${uuid}`);
  }

}

export default new CheatConnector();
