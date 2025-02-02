import { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { Result } from '../../model/common/Result.ts';
import { modalOpen } from '../../model/common/View.ts';
import { userStore } from '../../store/UserStore.ts';
import config from '../../utils/Config.ts';
import { emitter } from '../../utils/Event.ts';
import { handleError, initApiClient, initReqId, logError, logResponse } from './Support.ts';

export class ClientConnector {

  private readonly apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    const configuration = config || {};
    configuration.url = url;
    configuration.method = 'GET';
    return this.call(configuration, silent);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    return this.send('POST', url, data, config, silent);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    return this.send('PUT', url, data, config, silent);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    return this.send('DELETE', url, undefined, config, silent);
  }

  private async call<T = any>(config: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    const reqId = initReqId();
    const result = new Result<T>(reqId);
    try {
      config.headers = Object.assign({}, config.headers || {}, {
        'X-Request-Id': reqId,
        'X-User': userStore.getUser()?.username
      });
      const response = await this.apiClient.request(config);
      result.timer.stop();
      logResponse(this.apiClient, config, response, result.timer);
      result.data = response.data;
      return Promise.resolve(result);
    } catch (error: any) {
      result.timer.stop();
      handleError(result, error);
      logError(this.apiClient, config, result.error!, result.timer);
      if (!silent) {
        emitter.emit('result-error', modalOpen(result));
      }
      return Promise.resolve(result);
    }
  }

  private async send<T = any>(method: string, url: string, data?: any, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>> {
    const configuration = config || {};
    configuration.url = url;
    configuration.data = data;
    configuration.method = method;
    return this.call(configuration, silent);
  }

}

export const catalogConnector = new ClientConnector(initApiClient(config.catalogUrl, config.catalogUsername, config.catalogPassword));
