import { service } from './domains';
export default { service };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FLOWOOH_DATA_DB_CLIENT: string;
      FLOWOOH_DATA_DB_PATH: string;
    }
  }
}
