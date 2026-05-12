import { UserController } from '@/lib/server/app/modules/user/user.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const POST = UserController.createUser;
