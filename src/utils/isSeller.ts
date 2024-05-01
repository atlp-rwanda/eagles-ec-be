import { Request, Response, NextFunction } from 'express';
import {Role} from '../sequelize/models/roles';

export const isSeller = async (user: any): Promise<boolean> => {

    const roleId  = user.roleId;
    const role = await Role.findByPk(roleId);
    if (role?.name !== 'seller') {
      return false;
    }
    return true;
  };