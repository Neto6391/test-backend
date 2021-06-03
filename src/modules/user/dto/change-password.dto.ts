import { IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}