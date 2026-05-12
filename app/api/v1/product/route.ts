import { ProductController } from '@/lib/server/app/modules/product/product.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const POST = auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN)(ProductController.createProduct);
export const GET = ProductController.getAllProducts;
