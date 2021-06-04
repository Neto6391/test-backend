import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "../user/user.entity";

@Table
export class Address extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address: number; 
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    state:string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    postalCode: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    country: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;
}