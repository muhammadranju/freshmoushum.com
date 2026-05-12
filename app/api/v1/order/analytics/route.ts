import { OrderController } from '@/lib/server/app/modules/order/order.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const GET = auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN)(OrderController.getAnalytics);
