import { ref, type Ref } from 'vue';
import handbookConnector from '../connector/HandbookConnector.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { type IHandbook, Handbook } from '../model/Handbook.ts';

export class HandbookStore {

  handbook: Ref<IHandbook>;

  constructor() {
    this.handbook = ref({} as IHandbook);
  }

  async load(game: string): Promise<IResult> {
    const response = await handbookConnector.find(game);
    if (response.isOk()) {
      this.handbook.value = response.data!;
    }
    return response;
  }

  async get(game: string, uuid: string): Promise<Result<IHandbook>> {
    return await handbookConnector.get(game, uuid);
  }

  async add(game: string, request: Handbook): Promise<IResult> {
    return await handbookConnector.add(game, request);
  }

  async update(game: string, uuid: string, request: Handbook): Promise<IResult> {
    return await handbookConnector.update(game, uuid, request);
  }

  async remove(game: string): Promise<IResult> {
    return await handbookConnector.remove(game, this.handbook.value.uuid);
  }

}
