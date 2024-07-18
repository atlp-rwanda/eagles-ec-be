import sequelize from "../../config/dbConnection";
import { Model,DataTypes } from "sequelize";
import User from "./users";
import Message from "./messages";

export interface PrivateChatAttributes{
    id?:number,
    userId:number,
    receiverId:number,
    createdAt?:Date,
    updatedAt?:Date
}

class PrivateChat extends Model<PrivateChatAttributes> implements PrivateChatAttributes{
    id?:number;
    userId!:number;
    receiverId!:number;
    createdAt?:Date;
    updatedAt?:Date;
}


PrivateChat.init({
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"User",
            key:"id"
        }
    },
    receiverId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"User",
            key:"id"
        }
    },
    createdAt:{
        allowNull: false,
        type:DataTypes.DATE
    },
    updatedAt:{
        allowNull: false,
        type:DataTypes.DATE
    }
},{
    sequelize,
    modelName:"PrivateChats"
});

User.hasMany(PrivateChat, {
    foreignKey: 'userId',
    as: 'sentChats'
});
PrivateChat.belongsTo(User, {
    foreignKey: 'userId',
    as: 'sender'
});

User.hasMany(PrivateChat, {
    foreignKey: 'receiverId',
    as: 'receivedChats'
});
PrivateChat.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

export default PrivateChat;