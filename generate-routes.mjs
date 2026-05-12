import fs from 'fs';
import path from 'path';

const routes = [
  // Auth
  { path: 'auth/login', methods: ['POST'], controller: 'AuthController.loginUser', import: '@/lib/server/app/modules/auth/auth.controller', module: 'auth', auth: [] },
  { path: 'auth/forget-password', methods: ['POST'], controller: 'AuthController.forgetPassword', import: '@/lib/server/app/modules/auth/auth.controller', module: 'auth', auth: [] },
  { path: 'auth/verify-email', methods: ['POST'], controller: 'AuthController.verifyEmail', import: '@/lib/server/app/modules/auth/auth.controller', module: 'auth', auth: [] },
  { path: 'auth/reset-password', methods: ['POST'], controller: 'AuthController.resetPassword', import: '@/lib/server/app/modules/auth/auth.controller', module: 'auth', auth: [] },
  { path: 'auth/change-password', methods: ['POST'], controller: 'AuthController.changePassword', import: '@/lib/server/app/modules/auth/auth.controller', module: 'auth', auth: ["USER_ROLES.ADMIN", "USER_ROLES.USER"] },
  // CMS
  { path: 'cms', methods: ['POST', 'GET'], controllers: { POST: 'CMSController.createCMS', GET: 'CMSController.getAllCMS' }, import: '@/lib/server/app/modules/cms/cms.controller', module: 'cms', auth: { POST: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  { path: 'cms/[key]', methods: ['GET', 'PATCH', 'DELETE'], controllers: { GET: 'CMSController.getSingleCMS', PATCH: 'CMSController.updateCMS', DELETE: 'CMSController.deleteCMS' }, import: '@/lib/server/app/modules/cms/cms.controller', module: 'cms', auth: { PATCH: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"], DELETE: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  // Product
  { path: 'product', methods: ['POST', 'GET'], controllers: { POST: 'ProductController.createProduct', GET: 'ProductController.getAllProducts' }, import: '@/lib/server/app/modules/product/product.controller', module: 'product', auth: { POST: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  { path: 'product/reorder', methods: ['PATCH'], controller: 'ProductController.reorderProducts', import: '@/lib/server/app/modules/product/product.controller', module: 'product', auth: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] },
  { path: 'product/[id]', methods: ['GET', 'PATCH', 'DELETE'], controllers: { GET: 'ProductController.getSingleProduct', PATCH: 'ProductController.updateProduct', DELETE: 'ProductController.deleteProduct' }, import: '@/lib/server/app/modules/product/product.controller', module: 'product', auth: { PATCH: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"], DELETE: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  // Order
  { path: 'order', methods: ['POST', 'GET'], controllers: { POST: 'OrderController.createOrder', GET: 'OrderController.getAllOrders' }, import: '@/lib/server/app/modules/order/order.controller', module: 'order', auth: { GET: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  { path: 'order/[id]', methods: ['GET', 'PATCH', 'DELETE'], controllers: { GET: 'OrderController.getSingleOrder', PATCH: 'OrderController.updateOrder', DELETE: 'OrderController.deleteOrder' }, import: '@/lib/server/app/modules/order/order.controller', module: 'order', auth: { GET: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"], PATCH: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"], DELETE: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  // Review
  { path: 'review', methods: ['POST', 'GET'], controllers: { POST: 'ReviewController.createReview', GET: 'ReviewController.getAllReviews' }, import: '@/lib/server/app/modules/review/review.controller', module: 'review', auth: { POST: [] } },
  { path: 'review/[id]', methods: ['GET', 'PATCH', 'DELETE'], controllers: { GET: 'ReviewController.getSingleReview', PATCH: 'ReviewController.updateReview', DELETE: 'ReviewController.deleteReview' }, import: '@/lib/server/app/modules/review/review.controller', module: 'review', auth: { PATCH: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"], DELETE: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN"] } },
  // User
  { path: 'user', methods: ['POST'], controller: 'UserController.createUser', import: '@/lib/server/app/modules/user/user.controller', module: 'user', auth: [] },
  { path: 'user/profile', methods: ['GET', 'PATCH'], controllers: { GET: 'UserController.getUserProfile', PATCH: 'UserController.updateProfile' }, import: '@/lib/server/app/modules/user/user.controller', module: 'user', auth: { GET: ["USER_ROLES.ADMIN", "USER_ROLES.USER"], PATCH: ["USER_ROLES.SUPER_ADMIN", "USER_ROLES.ADMIN", "USER_ROLES.USER"] } },
];

routes.forEach(route => {
  const fullPath = path.join('e:\\\\2025\\\\Fresh MouShum - 2\\\\app\\\\api\\\\v1', route.path);
  fs.mkdirSync(fullPath, { recursive: true });
  
  let importName = route.import.split('/').pop().split('.')[0].replace(/^./, (c) => c.toUpperCase()) + 'Controller';
  if (importName === 'AuthControllerController') importName = 'AuthController';
  if (importName === 'CmsController') importName = 'CMSController';
  
  let fileContent = `import { ${importName} } from '${route.import}';\n`;
  fileContent += `import auth from '@/lib/server/app/middlewares/auth';\n`;
  fileContent += `import { USER_ROLES } from '@/lib/server/enums/user';\n\n`;
  
  route.methods.forEach(method => {
    let controllerMethod = route.controllers ? route.controllers[method] : route.controller;
    let authConfig = route.auth && route.auth[method] ? route.auth[method] : (Array.isArray(route.auth) ? route.auth : []);
    
    if (authConfig && authConfig.length > 0) {
      fileContent += `export const ${method} = auth(${authConfig.join(', ')})(${controllerMethod});\n`;
    } else {
      fileContent += `export const ${method} = ${controllerMethod};\n`;
    }
  });

  fs.writeFileSync(path.join(fullPath, 'route.ts'), fileContent);
});

console.log('Routes generated!');
