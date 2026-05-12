import { Model } from 'mongoose';

export type IReview = {
  name: string;
  location: string;
  comment: string;
  rating: number;
  image?: string;
  isDeleted?: boolean;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
