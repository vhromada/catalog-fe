export interface IApiExchange {
  headers?: unknown;
  data?: unknown;
}

export interface IApiExchangeEvent {
  apiMethod: string;
  apiUrl: string;
  apiRequest?: IApiExchange;
  apiResponse?: IApiExchange;
  apiStatusCode: string | number;
  apiResponseTime: string;
  message?: string;
  detail?: string;
  loggingTime: string;
}
