import * as dotenv from 'dotenv';
import { logger } from './logger';
const result = dotenv.config();

if (result.error) {
    logger.panic('Env file is not detected', result.error);
}

