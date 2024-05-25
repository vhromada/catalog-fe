import { AxiosRequestConfig } from 'axios';
import { INameFilter } from '../model/common/Filter.ts';
import { IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { Game, IGame, IGameStatistics } from '../model/Game';
import { catalogConnector } from './common/CatalogConnector.ts';

export class GameConnector {

  async search(filter: INameFilter): Promise<Result<IPage<IGame>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IGame>>('games', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IGame>> {
    return await catalogConnector.get<IGame>(`games/${uuid}`);
  }

  async add(request: Game): Promise<Result<IGame>> {
    return await catalogConnector.post<IGame>('games', request);
  }

  async update(uuid: string, request: Game): Promise<Result<IGame>> {
    return await catalogConnector.put<IGame>(`games/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`games/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IGame>> {
    return await catalogConnector.post<IGame>(`games/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IGameStatistics>> {
    return await catalogConnector.get<IGameStatistics>('games/statistics');
  }

}

export default new GameConnector();
