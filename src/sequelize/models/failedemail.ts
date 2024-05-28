import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/dbConnection';

interface FailedEmailAttributes {
  id: number;
  userId: number;
  email: string;
  subject: string;
  body: string;
  attempts: number;
  lastAttempted: Date;
}

class FailedEmail extends Model<FailedEmailAttributes> implements FailedEmailAttributes {
   id!: number;
   userId!: number;
   email!: string;
   subject!: string;
   body!: string;
   attempts!: number;
   lastAttempted!: Date;
}

FailedEmail.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastAttempted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'failedEmails',
});

export default FailedEmail;
