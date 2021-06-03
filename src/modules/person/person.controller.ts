import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(
        private readonly personService: PersonService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() body, @Request() req) {
        
    }

}


