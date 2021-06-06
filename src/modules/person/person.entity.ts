import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Address } from "../address/address.entity";
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

    @BelongsTo(()=> User, { foreignKey: 'userId' })
    user: User

    @HasMany(() => Address, { sourceKey: 'id', foreignKey: 'personId' })
    personAddresses: Address
}