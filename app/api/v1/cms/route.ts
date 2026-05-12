import { CMSController } from '@/lib/server/app/modules/cms/cms.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const POST = auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN)(CMSController.upsertCMS);
export const GET = CMSController.getAllCMS;
