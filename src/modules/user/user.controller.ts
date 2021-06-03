import { Controller, Post, UseGuards, Request, Body, Delete, Param, NotFoundException, UnauthorizedException, Patch, BadRequestException } from '@nestjs/common';
import { DoesUserExist } from 'src/core/guards/does-user-exists.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { UserDto, ChangePasswordDto } from './dto';
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
    @Patch(':id/change-password')
    async changePassword(@Param('id') idParam: number,  @Body() password: ChangePasswordDto, @Request() req) {
        const { id: userIdAuth } = req.user;
        
        const verifyLengthOfBody: Number = Object.keys(password).length; 
        
        if (verifyLengthOfBody > 1) {
            throw new BadRequestException('Bad Params in Body of Request');
        }

        const numberOfAffectedRows = await this.userService.changePassword(password, idParam, userIdAuth as number);
        if (numberOfAffectedRows === null) {
            throw new UnauthorizedException('You are not authorized to perfom the operation');
        } else if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This User doesn\'t exist');
        }
        return 'Successfully updated';
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
