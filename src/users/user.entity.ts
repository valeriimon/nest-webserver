import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import * as crypto from 'crypto';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';
import { logger } from "../../logger";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn()
    id: number
    
    @IsString()
    @IsNotEmpty()
    @Column({
        nullable: false
    })
    firstname: string

    @IsString()
    @Column()
    lastname: string

    @IsString()
    @IsNotEmpty()
    @Column()
    password: string

    @IsNumber()
    @Column({
        unsigned: true
    })
    age: number

    @IsString()
    @Column({
        // enum: ["male", "female"] 
        // Enum is nit suported by mysql version
    })
    gender: 'male' | 'female'

    @IsEmail()
    @Column({
        nullable: false,
        unique: true
    })
    email: string

    @Column(
        // enum: ['customer', 'admin']
        // Enum is nit suported by mysql version
    )
    role: 'customer' | 'admin'

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    created: Date

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updated: Date

    @BeforeInsert()
    biTriggerHandler() {
        logger.warn('Before inserting', 'DEBUG');
        this.hashPassword();
        this.created = new Date();
    }

    @BeforeUpdate()
    buTriggerHandler() {
        logger.warn('Before updating', 'DEBUG')
        this.hashPassword();
        this.updated = new Date();
    }

    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex')
    }
}