import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { logger } from '../../logger';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    private envConfig: {[key: string]: string}
    constructor() {
        const [arg] = process.argv.slice(-1);
        const filePath = path.resolve(__dirname, path.relative(__dirname, arg));

        this.envConfig = dotenv.parse(fs.readFileSync(`${filePath}`));
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.get('DB_HOST'),
            port: this.get('DB_PORT') as (number | any),
            username: this.get('DB_USERNAME'),
            password: this.get('DB_PASSWORD'),
            database: this.get('DB_NAME'),
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            synchronize: true,
            debug: ['console']
        }
    }

    get(key: string) {
        return this.envConfig[key]
    }
}
