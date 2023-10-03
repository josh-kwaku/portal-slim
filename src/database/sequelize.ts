import { Options, Sequelize } from 'sequelize';
import { dbSetupPolicyModel } from '../components/policy/models/policy';
import logger from '../helpers/logger';

export class DbClient {
    static instance: Sequelize
  
    public static getInstance(): Sequelize {
      if (typeof DbClient.instance === 'undefined') {
        const dbOptions: Options = {
          logging: (message: string): void => {
            logger.info('DB Client', message)
          }
        }
        try {
            DbClient.instance = new Sequelize(process.env.ALTEOS_POSTGRES_DB_NAME, process.env.ALTEOS_POSTGRES_DB_USERNAME, process.env.ALTEOS_POSTGRES_DB_PASSWORD, {
                host: process.env.ALTEOS_POSTGRES_DB_HOST,
                dialect: 'postgres',
                logging: true,
                ...dbOptions
              });   
        } catch (error) {
            console.error("Error: ", error);
        }
      }
  
      return DbClient.instance
    }
  }

//   function createDbClient(
//     options: Options = {}
//   ): Sequelize {
//     return DbClient.getInstance(options)
//   }
  
//   export function setupDB(): Sequelize {
//     const dbClient: Sequelize = createDbClient()
//     dbSetupPolicyModel(dbClient);
//     return dbClient
//   }