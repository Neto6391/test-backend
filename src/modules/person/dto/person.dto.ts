import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";

enum Gender {
    male = 'M',
    female = 'F',
}

export class PersonDto {
    @IsNotEmpty()
    readonly name:string;

    @IsNotEmpty()
    @IsEnum(Gender, {
        message: "gender must be either 'M' or 'F'"
    })
    readonly gender: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly birthday: Date;

}