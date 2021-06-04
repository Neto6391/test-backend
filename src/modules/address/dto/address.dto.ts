import { IsNotEmpty, MinLength, minLength } from "class-validator"

export class AddressDto {
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    city: string;
    
    @IsNotEmpty()
    @MinLength(2)
    state: string;
    
    @IsNotEmpty()
    postalCode: string;
    
    @IsNotEmpty()
    country: string;
}