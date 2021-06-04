import { Address } from "./address.entity";
import { ADDRESS_REPOSITORY } from "src/core/constants";

export const addressProviders = [{
    provide: ADDRESS_REPOSITORY,
    useValue: Address
}];