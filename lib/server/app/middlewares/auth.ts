import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import { handleGlobalError } from './globalErrorHandler';

const auth =
  (...roles: string[]) =>
  (handler: (req: NextRequest, context: any) => Promise<NextResponse>) =>
  async (req: NextRequest, context: any) => {
    try {
      const tokenWithBearer = req.headers.get('authorization');
      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];

        //verify token
        const verifyUser = jwtHelper.verifyToken(
          token,
          config.jwt.jwt_secret as Secret
        );
        //set user to req (mutating NextRequest is tricky, we can inject it via our catchAsync wrapper but it's easier to inject it manually)
        (req as any).user = verifyUser;

        //guard user
        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api"
          );
        }

        return await handler(req, context);
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
    } catch (error) {
      return handleGlobalError(error);
    }
  };

export default auth;
