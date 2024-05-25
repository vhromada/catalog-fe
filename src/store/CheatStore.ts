import { Ref, ref } from 'vue';
import cheatConnector from '../connector/CheatConnector.ts';
import { Cheat, ICheat } from '../model/Cheat.ts';
import { IResult, Result } from '../model/common/Result.ts';

export class CheatStore {

  cheat: Ref<ICheat>;

  constructor() {
    this.cheat = ref({} as ICheat);
  }

  async load(game: string): Promise<IResult> {
    const response = await cheatConnector.find(game);
    if (response.isOk()) {
      this.cheat.value = response.data!!;
    }
    return response;
  }

  async get(game: string, uuid: string): Promise<Result<ICheat>> {
    return await cheatConnector.get(game, uuid);
  }

  async add(game: string, request: Cheat): Promise<IResult> {
    return await cheatConnector.add(game, request);
  }

  async update(game: string, uuid: string, request: Cheat): Promise<IResult> {
    return await cheatConnector.update(game, uuid, request);
  }

  async remove(game: string): Promise<IResult> {
    return await cheatConnector.remove(game, this.cheat.value.uuid);
  }

}
