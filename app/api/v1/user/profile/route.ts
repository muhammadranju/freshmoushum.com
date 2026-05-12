import { UserController } from '@/lib/server/app/modules/user/user.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const GET = auth(USER_ROLES.ADMIN, USER_ROLES.USER)(UserController.getUserProfile);
export const PATCH = auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER)(UserController.updateProfile);
