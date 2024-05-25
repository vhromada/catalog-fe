export class Config {
  public readonly data: Map<string, any>;
  public readonly catalogUrl: string;
  public readonly catalogUsername: string;
  public readonly catalogPassword: string;
  public readonly hashSalt: string;
  public readonly logEnabled: boolean;
  public readonly consoleLogEnabled: boolean;
  public readonly itemsPerPage: number;
  public readonly allDataCount: number;

  constructor(data: Map<string, any>) {
    this.data = data;
    this.catalogUrl = param('VITE_APP_CATALOG_URL', data);
    this.catalogUsername = param('VITE_APP_CATALOG_USERNAME', data);
    this.catalogPassword = param('VITE_APP_CATALOG_PASSWORD', data);
    this.hashSalt = param('VITE_APP_HASH_SALT', data);
    this.logEnabled = toBoolean(param('VITE_APP_LOG_ENABLED', data));
    this.consoleLogEnabled = toBoolean(param('VITE_APP_LOG_CONSOLE_ENABLED', data));
    this.itemsPerPage = parseInt(param('VITE_APP_ITEMS_PER_PAGE', data));
    this.allDataCount = parseInt(param('VITE_APP_ALL_DATA_COUNT', data));
  }

}

function param(key: string, data: Map<string, any>): any {
  const env = import.meta.env[key];
  if (isValueDefied(env)) {
    return env;
  }
  return data.get(key);
}

function toBoolean(source: any = false): boolean {
  if (source === 'true' || source === '1') {
    return true;
  } else if (source === 'false' || source === '0') {
    return false;
  }
  return !!source;
}

function getConfig(): Map<string, any> {
  const file = loadConfig();
  const data = new Map();
  Object.keys(file).forEach((key) => {
    const value = file[key];
    if (isValueDefied(value)) {
      data.set(key, value);
    }
  });
  Object.keys(import.meta.env)
    .filter((key) => key.startsWith('VITE_APP_') && !data.has(key) && isValueDefied(import.meta.env[key]))
    .forEach((key) => {
      data.set(key, import.meta.env[key]);
    });
  return data;
}

function isValueDefied(value: string): boolean {
  return value !== undefined && value !== null && value !== '';
}

function loadConfig(): any {
  const url = '/config.json';
  const request = new XMLHttpRequest();
  request.open('GET', url, false); // synchronous call
  request.send(/* body */ null);
  try {
    return JSON.parse(request.responseText);
  } catch (e) {
    throw `Cannot load configuration file: url=${url}, error=${JSON.stringify(e)}`;
  }
}

export default new Config(getConfig());
