import { Schema, model, models } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['mango', 'lychee', 'other'], required: true },
    weight: { type: String, required: true },
    quantity: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    popular: { type: Boolean, default: false },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    image: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Product = models.Product || model<IProduct, ProductModel>('Product', productSchema);
