import mitt, { type Emitter } from 'mitt';
import { type IResult } from '../model/common/Result.ts';
import { type ModalEvent } from '../model/common/View.ts';

type AppEvents = {
  'result-error': ModalEvent<IResult>;
  'picture': ModalEvent<string>;
};

export const emitter: Emitter<AppEvents> = mitt<AppEvents>();
