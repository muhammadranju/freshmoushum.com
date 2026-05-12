import { Model, Types } from 'mongoose';

export type IOrder = {
  customerName: string;
  phone: string;
  address: string;
  product?: Types.ObjectId;
  packageName: string;
  quantity: number;
  totalPrice: number;
  note?: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
