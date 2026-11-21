import { ref, type Ref } from 'vue';
import walkthroughConnector from '../connector/WalkthroughConnector.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { type IWalkthrough, Walkthrough } from '../model/Walkthrough.ts';

export class WalkthroughStore {

  walkthrough: Ref<IWalkthrough>;

  constructor() {
    this.walkthrough = ref({} as IWalkthrough);
  }

  async load(game: string): Promise<IResult> {
    const response = await walkthroughConnector.find(game);
    if (response.isOk()) {
      this.walkthrough.value = response.data!;
    }
    return response;
  }

  async get(game: string, uuid: string): Promise<Result<IWalkthrough>> {
    return await walkthroughConnector.get(game, uuid);
  }

  async add(game: string, request: Walkthrough): Promise<IResult> {
    return await walkthroughConnector.add(game, request);
  }

  async update(game: string, uuid: string, request: Walkthrough): Promise<IResult> {
    return await walkthroughConnector.update(game, uuid, request);
  }

  async remove(game: string): Promise<IResult> {
    return await walkthroughConnector.remove(game, this.walkthrough.value.uuid);
  }

}
