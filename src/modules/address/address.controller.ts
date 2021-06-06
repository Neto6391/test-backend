import { Body, Controller, Post, UseGuards, Request, Get, BadRequestException, Put, NotFoundException, Param, Delete } from '@nestjs/common';
import { DoesAddressExist } from 'src/core/guards/does-address-exists.guard';
import { DoesPersonFound } from 'src/core/guards/does-person-found.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

@Controller('address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService
    ) {}

    @UseGuards(JwtAuthGuard, DoesPersonFound, DoesAddressExist)
    @Post('create')
    async create(@Body() body: AddressDto, @Request() req) {
        const { id: personId } = req.user.person;
        const address = await this.addressService.create(body, personId);
        
        return {
            address,
            message: "Address was successfully created!"
        }
    }

    @UseGuards(JwtAuthGuard, DoesPersonFound)
    @Get('read')
    async read(@Request() req) {
        let page;
        let limit;
        let address;
    
        const typeofVariableForbiddenForString = ["string","boolean", "object", "undefined"];

        if (req.query.page && typeofVariableForbiddenForString.includes(typeof req.query.page)) {
            if (req.query.page.length > 1) throw new BadRequestException('Bad Params in Body of Request');            
        }

        if (req.query.limit && typeofVariableForbiddenForString.includes(typeof req.query.limit)) {
            if (req.query.limit.length > 1) throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (req.query.address && typeofVariableForbiddenForString.includes(typeof req.query.address)) {
            if (req.query.address <= 1)  throw new BadRequestException('Bad Params in Body of Request'); 
           
        }

        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.address) {
            address = req.query.address;
        }

        const { id: personId } = req.user.person;

        return await this.addressService.read(personId, page, limit, address);
    }


    @UseGuards(JwtAuthGuard, DoesPersonFound, DoesAddressExist)
    @Put(':id/update')
    async update(@Param('id') idParam:Number,  @Body() body: AddressDto, @Request() req) {
        const { id: personId } = req.user.person;
        const numberOfAffectedRows = await this.addressService.update(body, idParam, personId);

        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Address doesn\'t exist');
        }

        return { message: "Address was successfully updated!" };
    }


    @UseGuards(JwtAuthGuard, DoesPersonFound)
    @Delete(':id')
    async delete(@Param('id') idParam:Number,  @Request() req) {
        const { id: personId } = req.user.person;
        const deleted = await this.addressService.delete(idParam, personId);

        if(deleted === 0) {
            throw new NotFoundException('This address doesn\'t exist');
        }
        return { message: "Successfully deleted" };
    }
}
