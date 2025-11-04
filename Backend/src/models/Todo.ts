import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TodoAttributes {
    id: number;
    text: string;
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, 'id' | 'completed' | 'createdAt' | 'updatedAt'> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
    public id!: number;
    public text!: string;
    public completed!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Todo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'todos',
        timestamps: true
    }
);

export default Todo;

