import { Controller, Post, UseGuards, Request, Body, Delete, Param, NotFoundException, UnauthorizedException, Patch, BadRequestException, Get, RequestMapping } from '@nestjs/common';
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

    @Get('read')
    async read(@Request() req) {
        let page;
        let limit;
        let email;
    
        const typeofVariableForbiddenForString = ["string","boolean", "object", "undefined"];

        if (req.query.page && typeofVariableForbiddenForString.includes(typeof req.query.page)) {
            if (req.query.page.length > 1) throw new BadRequestException('Bad Params in Body of Request');            
        }

        if (req.query.limit && typeofVariableForbiddenForString.includes(typeof req.query.limit)) {
            if (req.query.limit.length > 1) throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (req.query.email && typeofVariableForbiddenForString.includes(typeof req.query.email)) {
            if (req.query.email <= 1)  throw new BadRequestException('Bad Params in Body of Request'); 
           
        }

        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.email) {
            email = req.query.email;
        }
        return await this.userService.read(page, limit, email);
    }

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
    @Patch('change-password')
    async changePassword(@Body() password: ChangePasswordDto, @Request() req) {
        const { id: userIdAuth } = req.user;
        
        const verifyLengthOfBody: Number = Object.keys(password).length; 
        
        if (verifyLengthOfBody > 1) {
            throw new BadRequestException('Bad Params in Body of Request');
        }

        const numberOfAffectedRows = await this.userService.changePassword(password, userIdAuth as number);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This User doesn\'t exist');
        }
        return { message: "Successfully updated" };
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
        return { message: "Successfully deleted" };
    }

}
