import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CMSService } from './cms.service';

const upsertCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.upsertCMS(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CMS content updated successfully',
    data: result,
  });
});

const getCMSByKey = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getCMSByKey(req.params.key as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CMS content fetched successfully',
    data: result,
  });
});

const getAllCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getAllCMS();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All CMS content fetched successfully',
    data: result,
  });
});

export const CMSController = {
  upsertCMS,
  getCMSByKey,
  getAllCMS,
};
