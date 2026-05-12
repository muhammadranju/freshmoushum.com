import { ReviewController } from '@/lib/server/app/modules/review/review.controller';
import auth from '@/lib/server/app/middlewares/auth';
import { USER_ROLES } from '@/lib/server/enums/user';

export const POST = ReviewController.createReview;
export const GET = ReviewController.getAllReviews;
