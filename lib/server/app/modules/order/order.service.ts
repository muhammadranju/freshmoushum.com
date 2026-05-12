import { QueryBuilder } from '../../builder/QueryBuilder';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  const result = await Order.create(payload);
  return result;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find().populate('product'), query)
    .search(['customerName', 'phone', 'packageName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id).populate('product');
  return result;
};

const updateOrderStatus = async (
  id: string,
  payload: { status: string },
): Promise<IOrder | null> => {
  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getAnalytics = async () => {
  const now = new Date();
  // Calculate last 7 days in Bangladesh timezone (UTC+6)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last7Days },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
            timezone: 'Asia/Dhaka',
          },
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getAnalytics,
};
