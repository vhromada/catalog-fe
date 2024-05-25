import { Timer } from '../../utils/Timer.ts';
import { IApiExchange } from './Exchange';

export interface IResultError {
  code: string | number;
  name?: string;
  message?: string;
  detail?: string;
  request?: IApiExchange;
  response?: IApiExchange;
}

export enum ResultStatus {
  OK = 'OK',
  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  FAILURE = 'FAILURE',
  TIMEOUT = 'TIMEOUT'
}

export interface IResult {

  reqId: string;
  status: ResultStatus;
  error?: IResultError;
  timer: Timer;

  isOk(): boolean;

}

export class Result<T> implements IResult {

  public readonly reqId: string;
  status: ResultStatus = ResultStatus.OK;
  data?: T;
  error?: IResultError;
  timer: Timer = new Timer();

  constructor(source: string | IResult) {
    if (typeof source === 'string') {
      this.reqId = source;
    } else {
      this.reqId = source.reqId;
      this.status = source.status;
      this.error = source.error;
      this.timer = source.timer;
    }
  }

  public isOk(): boolean {
    return this.status === ResultStatus.OK;
  }

}
