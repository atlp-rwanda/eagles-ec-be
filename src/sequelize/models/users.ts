import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import { Role }from "./roles";


export interface UserAttributes{
  id?:number,
  name: string,
  username: string,
  email:string,
  password:string,
  roleId?: number;
  createdAt?:Date,
  updatedAt?:Date

}
class User extends Model<UserAttributes> implements UserAttributes {
  id!: number | undefined;
  name!: string;
  username!: string;
  email!: string;
  password!: string;
  roleId!: number | undefined;
  createdAt!: Date | undefined;
  updatedAt1: Date | undefined;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    roleId:{
      allowNull:false,
      type:DataTypes.NUMBER,
      defaultValue: 1, // default value for roleId is 1
      references:{
        model:"Roles",
        key:"id"
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelize,
    modelName: "users",
  },
);

// associations involved in the Role and User  tables

User.belongsTo(Role, {foreignKey: 'roleId', as: 'userRole'})
Role.hasMany(User, {foreignKey: 'roleId', as: 'users'})
export default User;
