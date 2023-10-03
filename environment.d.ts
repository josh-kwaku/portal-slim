declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      ALTEOS_POSTGRES_DB_USERNAME: string;
      ALTEOS_POSTGRES_DB_PASSWORD: string;
      ALTEOS_POSTGRES_DB_HOST: string;
      ALTEOS_POSTGRES_DB_NAME: string;
      AUTH_AUDIENCE: string;
      AUTH_ISSUER_URL: string;
      AUTH_TOKEN_ALG: string
    }
  }
  