import { Body, Controller, Post, UseGuards, Request, InternalServerErrorException, BadRequestException, Get, Put, NotFoundException } from '@nestjs/common';
import { DoesPersonExist } from 'src/core/guards/does-person-exists.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { PersonDto } from './dto/person.dto';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(
        private readonly personService: PersonService
    ) {}

    @UseGuards(JwtAuthGuard, DoesPersonExist)
    @Post('create')
    async create(@Body() body: PersonDto, @Request() req) {
        const { id: userId } = req.user;
        this.personService.create(body, userId);
        return { message: "Person was successfully created!" };
    }

    @UseGuards(JwtAuthGuard)
    @Get('read')
    async read(@Request() req) {
        let page;
        let limit;
        let name;
    
        const typeofVariableForbiddenForString = ["string","boolean", "object", "undefined"];

        if (req.query.page && typeofVariableForbiddenForString.includes(typeof req.query.page)) {
            if (req.query.page.length > 1) throw new BadRequestException('Bad Params in Body of Request');            
        }

        if (req.query.limit && typeofVariableForbiddenForString.includes(typeof req.query.limit)) {
            if (req.query.limit.length > 1) throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (req.query.name && typeofVariableForbiddenForString.includes(typeof req.query.name)) {
            if (req.query.name <= 1)  throw new BadRequestException('Bad Params in Body of Request'); 
           
        }

        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.name) {
            name = req.query.name;
        }

        return await this.personService.read(page, limit, name);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    async update(@Body() body: PersonDto, @Request() req) {
        const { id: userId } = req.user;
        const numberOfAffectedRows = await this.personService.update(body, userId);

        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Person doesn\'t exist');
        }

        return { message: "Person was successfully updated!" };
    }

    @UseGuards(JwtAuthGuard)
    @Get('read-by-location')
    async readByLocation(@Request() req) {
        let page;
        let limit;
        let city;
        let state;
    
        const typeofVariableForbiddenForString = ["string","boolean", "object", "undefined"];

        if (req.query.page && typeofVariableForbiddenForString.includes(typeof req.query.page)) {
            if (req.query.page.length > 1) throw new BadRequestException('Bad Params in Body of Request');            
        }

        if (req.query.limit && typeofVariableForbiddenForString.includes(typeof req.query.limit)) {
            if (req.query.limit.length > 1) throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (req.query.city && typeofVariableForbiddenForString.includes(typeof req.query.city)) {
            if (req.query.city <= 1)  throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (req.query.state && typeofVariableForbiddenForString.includes(typeof req.query.state)) {
            if (req.query.state <= 1)  throw new BadRequestException('Bad Params in Body of Request'); 
        }

        if (!req.query.city && !req.query.state) {
            throw new BadRequestException('Bad Params in Body of Request'); 
        }


        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.city) {
            city = req.query.city;
        }

        if (req.query.state) {
            state = req.query.state;
        }

        const { id: personId } = req.user.person;

        return await this.personService.readByLocation(page, limit, city, state, personId);
    }

}


