import { AutoIncrement, Column, DataType, Default, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Person } from "../person/person.entity";

@Table({
    paranoid: true
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
 
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;
   
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;


    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isAdmin: boolean;

    @HasOne(() => Person)
    person: Person
}