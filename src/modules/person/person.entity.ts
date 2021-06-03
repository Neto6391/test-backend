import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "../user/user.entity";

@Table
export class Person extends Model {
    @PrimaryKey
    @Unique
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.ENUM,
        values: ['M', 'F'],
        allowNull: false
    })
    gender: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    birthday: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;
}