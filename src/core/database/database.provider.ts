import { Sequelize } from 'sequelize-typescript';
import { Address } from 'src/modules/address/address.entity';
import { Person } from 'src/modules/person/person.entity';
import { User } from 'src/modules/user/user.entity';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config = {};
        switch(process.env.NODE_ENV) {
            case DEVELOPMENT:
                Object.assign(config, databaseConfig.development);
                break;
            case TEST:
                Object.assign(config, databaseConfig.test);
                break;
            case PRODUCTION:
                Object.assign(config, databaseConfig.production);
                break;
            default:
                Object.assign(config, databaseConfig.development);
                break;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([User, Person, Address]);
        await sequelize.sync();
        return sequelize;
    }
}];