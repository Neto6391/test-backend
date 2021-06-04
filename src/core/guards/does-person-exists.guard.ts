import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PersonService } from "src/modules/person/person.service";

@Injectable()
export class DoesPersonExist implements CanActivate {
    constructor(
        private readonly personService: PersonService
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const { id: userId } = request.user;
        const userExist = await this.personService.findOneByUserId(userId);

        if (userExist) {
            throw new ForbiddenException('This person already exist');
        }

        return true;
    }
}