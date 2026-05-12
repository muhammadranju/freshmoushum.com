import { NextResponse } from 'next/server';

type IData<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  data?: T;
  errorMessages?: {
    path: string;
    message: string;
  }[];
};

const sendResponse = <T>(res: any, data: IData<T>) => {
  const resData = {
    success: data.success,
    message: data.message,
    pagination: data.pagination,
    data: data.data,
  };
  return NextResponse.json(resData, { status: data.statusCode });
};

export default sendResponse;
