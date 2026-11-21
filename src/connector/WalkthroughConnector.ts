import { Result } from '../model/common/Result.ts';
import { type IWalkthrough, Walkthrough } from '../model/Walkthrough.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class WalkthroughConnector {

  async find(game: string): Promise<Result<IWalkthrough>> {
    return await catalogConnector.get<IWalkthrough>(`games/${game}/walkthroughs`);
  }

  async get(game: string, uuid: string): Promise<Result<IWalkthrough>> {
    return await catalogConnector.get<IWalkthrough>(`games/${game}/walkthroughs/${uuid}`);
  }

  async add(game: string, request: Walkthrough): Promise<Result<IWalkthrough>> {
    return await catalogConnector.post<IWalkthrough>(`games/${game}/walkthroughs`, request);
  }

  async update(game: string, uuid: string, request: Walkthrough): Promise<Result<IWalkthrough>> {
    return await catalogConnector.put<IWalkthrough>(`games/${game}/walkthroughs/${uuid}`, request);
  }

  async remove(game: string, uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`games/${game}/walkthroughs/${uuid}`);
  }

}

export default new WalkthroughConnector();
