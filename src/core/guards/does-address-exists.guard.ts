import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AddressService } from "src/modules/address/address.service";

@Injectable()
export class DoesAddressExist implements CanActivate {
    constructor(
        private readonly addressService: AddressService
      ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const addressExits = await this.addressService.findByAddressName(request.body.address);

        if (addressExits) {
            throw new ForbiddenException('This address already exist');
        }

        return true;
    }
}