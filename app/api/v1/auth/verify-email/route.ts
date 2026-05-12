import { AuthController } from '@/lib/server/app/modules/auth/auth.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const POST = AuthController.verifyEmail;
