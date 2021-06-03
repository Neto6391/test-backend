import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto';
import sequelize from 'sequelize';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,      
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    ) {}

    async findOneByEmail(email: string, filterOption?: object): Promise<User> {
        if (filterOption) {
            Object.assign(filterOption, { email });
            return await this.userRepository.findOne<User>({ where: filterOption, paranoid: false });
        }
        return await this.userRepository.findOne<User>({ where: { email }, paranoid: false });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findByPk<User>(id);
    }

    async authenticate(user) {
        return await this.authService.login(user);
    }

    async read(page?: number, limit?: Number, email?: string) {
        const filter = { deletedAt: null };
        limit = limit || 2;
        page = page || 1;
        const offset = Number(limit) * (Number(page) - 1);
        
        if (email) {
            Object.assign(filter, { email: {[sequelize.Op.like]:'%' + email + '%' } });
        }
        const {rows, count} = await this.userRepository.findAndCountAll({ where: filter, order: ['id'], offset, limit: Number(limit)});
        
        if (rows.length > 0) {
            const totalPages = Math.ceil(count / Number(limit));
            return {
                totalItems: count,
                rows,
                actualPage: Number(page),
                totalPages
            };
        } else {
            return { message: "There are not users available!" }
        }

        
    }

    async create(user) {
        const pass = await this.hashPassword(user.password);

        const newUser = await this.userRepository.create({ ...user, password: pass });
        const { password, ...result } = newUser['dataValues'];
        
        const token = await this.authService.generateToken(result);

        return { user: result, token };
    }

    async changePassword(data: ChangePasswordDto, idParam: number, userIdAuth: number) {
        if (Number(idParam) === userIdAuth) {
            const newHash = await this.hashPassword(data.password);
            const [numberOfAffectedRows] = await this.userRepository.update({password: newHash}, { where: { id: idParam }, returning: true });
            return numberOfAffectedRows;
        } else {
            return Promise.resolve(null);
        }
    }

    async softDelete(idParam, userIdAuth, isUserAdminAuth) {
        if (isUserAdminAuth) {
            return await this.userRepository.destroy({ where: { id: idParam } });
        } else if(idParam === userIdAuth) {
            return await this.userRepository.destroy({ where: { id: idParam } });
        } else {
            return idParam !== userIdAuth ? Promise.resolve(null) : Promise.resolve(0);
        }
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
}
