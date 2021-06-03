import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('authenticate')
    async login(@Request() req) {
        return await this.userService.authenticate(req.user);
    }

    @Post('create')
    async signUp(@Body() user: UserDto) {
        return await this.userService.create(user);
    }

}
