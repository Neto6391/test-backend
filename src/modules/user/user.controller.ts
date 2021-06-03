import { Controller, Post, UseGuards, Request, Body, Delete, Param, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/core/guards/does-user-exists.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}


    @UseGuards(LocalAuthGuard)
    @Post('authenticate')
    async authenticate(@Request() req ) {
        return await this.userService.authenticate(req.user);
    
    }

    @UseGuards(DoesUserExist)
    @Post('create')
    async create(@Body() user: UserDto) {
        return await this.userService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') idParam: number, @Request() req) {
        const { id: userIdAuth, isAdmin: isUserAdminAuth } = req.user
        const deleted = await this.userService.softDelete(idParam, userIdAuth, isUserAdminAuth);

        if (deleted === null) {
            throw new UnauthorizedException('You are not authorized to perfom the operation');
        } else if(deleted === 0) {
            throw new NotFoundException('This User doesn\'t exist');
        }
        return 'Successfully deleted';
    }

}
