import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findOneByEmail(email);
        
        if (!user) {
            return null;
        }

        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return null;
        }

        const { password, ...result } = user['dataValues'];
        return result;
    }

    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }
    

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}
