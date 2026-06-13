import {Table, Model, Column, DataType, Scopes, DefaultScope} from "sequelize-typescript";

interface UserCreationAttrs {
    email: string;
    password: string;
}

@DefaultScope(() => ({
    attributes: {exclude: ['password']}
}))
@Scopes(() => ({
    withPassword: {
        attributes: {include: ['password']}
    }
}))
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;
}