import { Db } from "mongodb";

declare global {
  namespace NodeJS {
    interface Process {
      db: Db;
    }
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
    }
  }
}

