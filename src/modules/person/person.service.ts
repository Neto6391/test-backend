import { forwardRef, Inject, Injectable, Post, UseGuards } from '@nestjs/common';
import sequelize from 'sequelize';
import { PERSON_REPOSITORY } from 'src/core/constants';
import { AddressService } from '../address/address.service';
import { Person } from './person.entity';

@Injectable()
export class PersonService {
    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person,
        @Inject(forwardRef(() => AddressService)) private readonly addressService: AddressService,
        ) {}

    async create(body, userId): Promise<Person> { 
        return await this.personRepository.create({...body, userId})
    }

    async read(page?: number, limit?: Number, name?: string) {

        limit = limit || 2;
        page = page || 1;

        const filter = {};
        console.log(filter)
        const offset = Number(limit) * (Number(page) - 1);

        if (name) {
            Object.assign(filter, { name: {[sequelize.Op.like]:'%' + name + '%' } });
        }

        const {rows, count} = await this.personRepository.findAndCountAll({ where: filter, attributes: { exclude: ['password', 'deletedAt'] }, order: ['id'], offset, limit: Number(limit)});

        if (rows.length > 0) {
            const totalPages = Math.ceil(count / Number(limit));
            return {
                totalItems: count,
                rows,
                actualPage: Number(page),
                totalPages
            };
        } else {
            return { message: "There are not persons available!" }
        }

    }

    async readByLocation(page, limit, city, state, userId) {
        return await this.addressService.readByLocation(page, limit, city, state, userId);
    }

    async update(body, userId) {
        const [numberOfAffectedRows] = await this.personRepository.update({...body, userId}, { where: { userId }, returning: true });
            return numberOfAffectedRows;
    }

    async findOneByUserId(userId: number) {
       return await this.personRepository.findOne({ where: { userId } });
    }
}
