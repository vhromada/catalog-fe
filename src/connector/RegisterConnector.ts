import { Result } from '../model/common/Result.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class RegisterConnector {

  async getProgramFormats(): Promise<Result<string[]>> {
    return await catalogConnector.get<string[]>('registers/formats/programs');
  }

  async getBookItemFormats(): Promise<Result<string[]>> {
    return await catalogConnector.get<string[]>('registers/formats/book-items');
  }

  async getLanguages(): Promise<Result<string[]>> {
    return await catalogConnector.get<string[]>('registers/languages');
  }

  async getSubtitles(): Promise<Result<string[]>> {
    return await catalogConnector.get<string[]>('registers/subtitles');
  }

}

export default new RegisterConnector();
