export interface IApiExchange {
  headers?: any;
  data?: any;
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
