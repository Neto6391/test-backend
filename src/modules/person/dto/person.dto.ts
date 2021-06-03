import { IsDate, IsEnum, IsNotEmpty } from "class-validator";

enum Gender {
    M = 'male',
    F = 'female',
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
    readonly birthday: Date;

}