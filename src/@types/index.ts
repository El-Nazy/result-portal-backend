import { MongoClient } from "mongodb";

declare global {
  namespace NodeJS {
    interface Process {
      dbClient: MongoClient;
    }
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      SALT_ROUNDS: string;
    }
  }
}

