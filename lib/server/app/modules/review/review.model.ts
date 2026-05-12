import { Schema, model, models } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    image: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Filter out deleted reviews
reviewSchema.pre(/^find/, function (this: any) {
  this.where({ isDeleted: { $ne: true } });
});

export const Review = models.Review || model<IReview, ReviewModel>('Review', reviewSchema);
