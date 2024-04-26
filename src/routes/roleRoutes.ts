import express from 'express';
import { roleController } from '../controllers/rolesController';
import { isLoggedIn } from '../middlewares/isLoggedIn';
const RoleRouter = express.Router();

RoleRouter.post('/', roleController.createRole);
RoleRouter.get('/', roleController.getRoles);
RoleRouter.patch('/:id', roleController.updateRole);
RoleRouter.delete('/:id', roleController.deleteRole);

export default RoleRouter;