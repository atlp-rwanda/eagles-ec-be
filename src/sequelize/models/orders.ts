import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import User from "./users";
import OrderItem from "./orderItems";
import Product from "./products";


export interface OrderAttributes {
  id?: number;
  buyerId?: number;
  status?: string;
  deliveryDate: Date;
  items?: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}


class Order extends Model<OrderAttributes> implements OrderAttributes {
  id!: number | undefined;
  buyerId!: number;
  status!: string;
  deliveryDate!: Date;
  items!: OrderItem[];
  createdAt!: Date | undefined;
  updatedAt!: Date | undefined;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Pending", "Delivered", "Cancelled"],
    defaultValue: "pending",
    allowNull: false,
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'orders',
});

Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
Order.hasMany(OrderItem, { foreignKey: "status", as: "statuses"})
Order.hasMany(Product, { foreignKey: "id", as: "products"})
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

export default Order