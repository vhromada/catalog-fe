import { createLogger } from 'vue-logger-plugin';
import config from './Config.ts';

const logger = createLogger({
  enabled: config.logEnabled,
  consoleEnabled: config.consoleLogEnabled,
  level: 'info',
  beforeHooks: [],
  afterHooks: []
});

export default logger;
