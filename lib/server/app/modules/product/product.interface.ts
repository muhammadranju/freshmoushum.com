import { Model } from 'mongoose';

export type IProduct = {
  name: string;
  category: 'mango' | 'lychee' | 'other';
  weight: string;
  quantity?: string;
  price: number;
  description: string;
  popular: boolean;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  orderIndex: number;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;
