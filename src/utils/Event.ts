import mitt, { type Emitter } from 'mitt';

export const emitter: Emitter<any> = mitt();
