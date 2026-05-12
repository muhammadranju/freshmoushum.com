import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products fetched successfully',
    data: {
      products: result.result,
      meta: result.meta,
    },
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    req.params.id as string,
    req.body,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(req.params.id as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const reorderProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.reorderProducts(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products reordered successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
};
