import { ArgumentMetadata, PipeTransform, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { getResponse } from 'shared/utils/utils';
import { logger } from '../../../../logger';

@Injectable()
export class ValidationPipe implements PipeTransform {

  constructor(public iType: new (...args: any[]) => any) {}

  async transform(user: any, {metatype}: ArgumentMetadata) {
    const instance = plainToClass(this.iType, user);
    const errors = await validate(instance) as ValidationError[];
    
    if(errors.length) {
        const errsStr = this.buildErrors(errors);
        return await getResponse(Promise.reject({message: errsStr}), 'Validation')
    }
    
    return instance;
  }

  buildErrors(errors: ValidationError[]) {
    return errors.map(item => {
      return Object.keys(item.constraints).reduce((acc, key) => {
        return acc += `${item.property}: ${item.constraints[key]}. Have (${item.value}) `;
      }, '')
    })
    .join('\n\n');
  }
}
