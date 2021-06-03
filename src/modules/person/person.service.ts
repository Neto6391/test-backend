import { Inject, Injectable, Post, UseGuards } from '@nestjs/common';
import { PERSON_REPOSITORY } from 'src/core/constants';
import { Person } from './person.entity';

@Injectable()
export class PersonService {
    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: typeof Person
    ) {}

    async create(): Promise<Person> { return Promise.resolve(new Person)}
}
