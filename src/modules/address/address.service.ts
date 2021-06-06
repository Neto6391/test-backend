import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { ADDRESS_REPOSITORY } from 'src/core/constants';
import { Person } from '../person/person.entity';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: typeof Address
    ) {}

    async create(body, personId): Promise<Address> {
        return await this.addressRepository.create({...body, personId})
    }

    async read(personId: number, page?: number, limit?: number, address?: string) {
        limit = limit || 10;
        page = page || 1;

        const filter = { personId };
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

    async update(body, idParam,personId) {
        const [numberOfAffectedRows] = await this.addressRepository.update({...body, personId}, { where: { id: idParam, personId }, returning: true });
            return numberOfAffectedRows;
    }

    async findByAddressName(address:string) {
        return await this.addressRepository.findOne({ where: { address } });
    }

    async delete(idParam, personId) {
        return await this.addressRepository.destroy({ where: { id: idParam, personId } });
    }

    async readByLocation(page, limit, city, state, personId) {
        limit = limit || 10;
        page = page || 1;

        const filter = {};
        const offset = Number(limit) * (Number(page) - 1);

        if (city && !state) {
            Object.assign(filter, { 
                city: {[sequelize.Op.like]:'%' + city + '%' },
                personId
            });
        } else if(state && !city) {
            Object.assign(filter, { 
                state: {[sequelize.Op.like]:'%' + state + '%' },
                personId 
            });
        } else if(state && city) {
            Object.assign(filter, { 
                state: {[sequelize.Op.like]:'%' + state + '%' },
                city:  {[sequelize.Op.like]:'%' + city + '%' },
                personId
            });
        }

        const {rows, count} = await this.addressRepository.findAndCountAll({ 
            where: filter, 
            include: [{
                model: Person,
                attributes: { exclude: ['createdAt', 'createdAt', 'updatedAt', 'userId', 'id'] }
            }],
            attributes: { 
                exclude: ['updatedAt', 'createdAt', 'personId'] 
            }, 
            order: ['id'], 
            offset, 
            limit: Number(limit)
        });

        if (rows.length > 0) {
            const totalPages = Math.ceil(count / Number(limit));
            return {
                totalItems: count,
                rows,
                actualPage: Number(page),
                totalPages
            };
        } else {
            return { message: "There are not address available from the user on this location!" }
        }
    }

}
