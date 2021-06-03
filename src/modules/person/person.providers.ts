import { Person } from "./person.entity";
import { PERSON_REPOSITORY } from "src/core/constants";

export const personsProviders = [{
    provide: PERSON_REPOSITORY,
    useValue: Person
}];