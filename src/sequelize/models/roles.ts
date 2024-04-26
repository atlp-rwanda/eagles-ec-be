import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export interface IRole {
  id?: number;
  name: string;
  permissions?: string;
}



const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
  host: 'localhost',
  dialect: 'postgres',
});

class Role extends Model {
  public id!: number;
  public name!: string;
  public permissions?: string;
}

Role.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  permissions: { 
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  tableName: 'Roles',
  sequelize,
});

export { Role };