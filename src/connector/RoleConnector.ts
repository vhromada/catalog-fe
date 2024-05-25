import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class RoleConnector {

  async getRoles(): Promise<Result<string[]>> {
    return await catalogConnector.get<string[]>('roles');
  }

}

export default new RoleConnector();
