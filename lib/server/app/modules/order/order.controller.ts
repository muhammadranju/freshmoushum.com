import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders fetched successfully',
    data: {
      result: result.result,
      meta: result.meta,
    },
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getSingleOrder(req.params.id as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order fetched successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(
    req.params.id as string,
    req.body,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAnalytics();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics fetched successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getAnalytics,
};
