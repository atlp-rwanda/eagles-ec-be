import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/dbConnection";
import Product from "./products";
import Order from "./orders";
import User from "./users"
import Profile from "./profiles";


export interface orderItemAttributes {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class OrderItem extends Model<orderItemAttributes> implements orderItemAttributes {
  id!: number | undefined;
  orderId!: number;
  productId!: number;
  quantity!: number;
  createdAt!: Date | undefined;
  updatedAt!: Date | undefined;
}

OrderItem.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    orderId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.NUMBER,
      references: {
        model: Product,
        key: "id",
      }
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
  },
  {
    sequelize: sequelize,
    modelName: "orderItems",
  },
);

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
});
OrderItem.belongsTo(User,{
  foreignKey: "userId",
  as: "user"
})


export default OrderItem;