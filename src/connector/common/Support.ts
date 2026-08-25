import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { type IApiExchange, type IApiExchangeEvent } from '../../model/common/Exchange.ts';
import { type IPagingFilter } from '../../model/common/Paging.ts';
import { type IResultError, Result, ResultStatus } from '../../model/common/Result.ts';
import logger from '../../utils/Logger.ts';
import { Timer } from '../../utils/Timer.ts';

export function initReqId(): string {
  return uuid();
}

export function initApiClient(baseURL: string, username: string, password: string): AxiosInstance {
  const result = axios.create({
    baseURL: baseURL,
    timeout: 20000,
    headers: {},
    withCredentials: false,
  });
  result.defaults.auth = {
    username: username,
    password: password
  };
  return result;
}

export function constructUrl(baseUrl = '', url = '', params: IPagingFilter): string {
  const result = baseUrl + url;
  if (params) {
    return result + params.toSearchParams().build();
  } else {
    return result;
  }
}

const initApiRequest = (config: AxiosRequestConfig): IApiExchange => {
  const apiRequest: IApiExchange = {};
  if (config.headers) {
    const headers = Object.assign({}, config.headers);
    if (headers['Authorization']) {
      headers['Authorization'] = '******';
    }
    apiRequest.headers = headers;
  }
  if (config.data) {
    apiRequest.data = config.data;
  }
  return apiRequest;
};

const initInfoEvent = (
  apiClient: AxiosInstance,
  reqConfig: AxiosRequestConfig,
  response: AxiosResponse,
  timer: Timer
): IApiExchangeEvent => {
  return {
    apiStatusCode: response.status,
    apiMethod: getMessage(reqConfig.method),
    apiUrl: constructUrl(reqConfig?.baseURL || apiClient.defaults?.baseURL, reqConfig.url, reqConfig.params),
    apiResponseTime: timer.time(),
    apiRequest: initApiRequest(response.config),
    apiResponse: {
      headers: response.headers,
      data: response.data
    },
    loggingTime: new Date().toISOString()
  };
};

const initErrorEvent = (
  apiClient: AxiosInstance,
  reqConfig: AxiosRequestConfig,
  error: IResultError,
  timer: Timer
): IApiExchangeEvent => {
  const event: IApiExchangeEvent = {
    apiStatusCode: getMessage(error.code),
    apiMethod: getMessage(reqConfig.method),
    apiUrl: constructUrl(reqConfig?.baseURL || apiClient.defaults?.baseURL, reqConfig.url, reqConfig.params),
    apiResponseTime: timer.time(),
    apiRequest: initApiRequest({
      headers: error.request?.headers || reqConfig.headers,
      data: error.request?.data || reqConfig.data
    }),
    message: error.message,
    detail: error.detail,
    loggingTime: new Date().toISOString()
  };
  if (error.response) {
    event.apiResponse = error.response;
  }
  return event;
};

export const logResponse = (
  apiClient: AxiosInstance,
  config: AxiosRequestConfig,
  response: AxiosResponse,
  timer: Timer
): void => {
  logger.info('Exchange', initInfoEvent(apiClient, config, response, timer));
};

export const logError = (
  apiClient: AxiosInstance,
  config: AxiosRequestConfig,
  error: IResultError,
  timer: Timer
): void => {
  logger.error('Exchange', initErrorEvent(apiClient, config, error, timer));
};

export function handleError<T = unknown>(result: Result<T>, error: unknown) {
  result.status = ResultStatus.FAILURE;
  if (axios.isAxiosError(error)) {
    result.status = ResultStatus.SERVER_ERROR;
    const resultError: IResultError = {
      code: getMessage(error.response?.status || error.code),
      name: error.name,
      message: getMessage(error.message || error.response?.data),
      detail: error.stack
    };
    if (error.request) {
      resultError.request = {
        headers: error.request.headers,
        data: error.request.data
      };
    }
    if (error.response) {
      resultError.response = {
        headers: error.response.headers,
        data: getMessage(error.response.data)
      };
    }
    result.error = resultError;
    if (error.response?.status && error.response?.status < 500) {
      result.status = ResultStatus.CLIENT_ERROR;
    }
  } else {
    result.error = {
      code: 'INTERNAL_ERROR',
      name: error instanceof Error ? error.name : 'Internal error',
      message: error instanceof Error ? error.message : String(error),
      detail: JSON.stringify(error)
    };
  }
}

function getMessage<T>(message: T): NonNullable<T> | string {
  return message ? (message as NonNullable<T>) : 'UNKNOWN';
}
