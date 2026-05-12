import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (payload: IReview): Promise<IReview> => {
  const result = await Review.create(payload);
  return result;
};

const getAllReviews = async () => {
  const result = await Review.find().sort({ createdAt: -1 });
  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>,
): Promise<IReview | null> => {
  const result = await Review.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteReview = async (id: string): Promise<IReview | null> => {
  const result = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
