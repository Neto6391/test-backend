import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,      
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    ) {}

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email }, paranoid: false });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findByPk<User>(id);
    }

    async authenticate(user) {
        return await this.authService.login(user);
    }

    async create(user) {
        const pass = await this.hashPassword(user.password);

        const newUser = await this.userRepository.create({ ...user, password: pass });
        const { password, ...result } = newUser['dataValues'];
        
        const token = await this.authService.generateToken(result);

        return { user: result, token };
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
