import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { ADDRESS_REPOSITORY } from 'src/core/constants';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: typeof Address
    ) {}

    async create(body, userId): Promise<Address> {
        return await this.addressRepository.create({...body, userId})
    }

    async read(page?: number, limit?: Number, address?: string) {
        limit = limit || 2;
        page = page || 1;

        const filter = {};
        console.log(filter)
        const offset = Number(limit) * (Number(page) - 1);

        if (address) {
            Object.assign(filter, { address: {[sequelize.Op.like]:'%' + address + '%' } });
        }


        const {rows, count} = await this.addressRepository.findAndCountAll({ where: filter, attributes: { exclude: ['updatedAt', 'createdAt'] }, order: ['id'], offset, limit: Number(limit)});

        if (rows.length > 0) {
            const totalPages = Math.ceil(count / Number(limit));
            return {
                totalItems: count,
                rows,
                actualPage: Number(page),
                totalPages
            };
        } else {
            return { message: "There are not address available!" }
        }

    }

    async update(body, idParam,userId) {
        const [numberOfAffectedRows] = await this.addressRepository.update({...body, userId}, { where: { id: idParam, userId }, returning: true });
            return numberOfAffectedRows;
    }

    async findByAddressName(address:string) {
        return await this.addressRepository.findOne({ where: { address } });
    }

    async delete(idParam, userId) {
        return await this.addressRepository.destroy({ where: { id: idParam, userId } });
    }

    async readByLocation(page, limit, city, state, userId) {
        limit = limit || 2;
        page = page || 1;

        const filter = {};
        const offset = Number(limit) * (Number(page) - 1);

        if (city && !state) {
            Object.assign(filter, { 
                city: {[sequelize.Op.like]:'%' + city + '%' },
                userId
            });
        } else if(state && !city) {
            Object.assign(filter, { 
                state: {[sequelize.Op.like]:'%' + state + '%' },
                userId 
            });
        } else if(state && city) {
            Object.assign(filter, { 
                state: {[sequelize.Op.like]:'%' + state + '%' },
                city:  {[sequelize.Op.like]:'%' + city + '%' },
                userId
            });
        }


        const {rows, count} = await this.addressRepository.findAndCountAll({ where: filter, attributes: { exclude: ['updatedAt', 'createdAt'] }, order: ['id'], offset, limit: Number(limit)});

        if (rows.length > 0) {
            const totalPages = Math.ceil(count / Number(limit));
            return {
                totalItems: count,
                rows,
                actualPage: Number(page),
                totalPages
            };
        } else {
            return { message: "There are not address available from this user!" }
        }
    }

}
