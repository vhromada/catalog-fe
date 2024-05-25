/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CATALOG_URL: string;
  readonly VITE_APP_CATALOG_USERNAME: string;
  readonly VITE_APP_CATALOG_PASSWORD: string;
  readonly VITE_APP_HASH_SALT: string;
  readonly VITE_APP_LOG_ENABLED: boolean;
  readonly VITE_APP_LOG_CONSOLE_ENABLED: boolean;
  readonly VITE_APP_ITEMS_PER_PAGE: number;
  readonly VITE_APP_ALL_DATA_COUNT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
