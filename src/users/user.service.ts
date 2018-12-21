import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>
        ) {}

    async createUser(userPayload: User) {
        return await this.usersRepository.save(userPayload)
    }

    async getUser(data: Partial<User>) {
        return await this.usersRepository.findOne(data);
    }

    async getUsers(skip: number, limit: number)  {
        const qb = await this.usersRepository.createQueryBuilder('user')
        
        if(skip) {
            qb.skip(skip)
        }
        
        if(limit) {
            qb.limit(limit)
        }
        
        return await qb.getManyAndCount().then(([users, total]) => ({users, total}));
    }

    async updateUser(id: number, user: User) {
        await this.usersRepository.update(id, user);
    }
}