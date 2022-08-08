import * as express from 'express';
import { verifyAccessJWT } from '../services/tokenService';
import UnauthorizedError from '../api/errors/UnauthorizedError';
import ErrorCodeEnum from '../@types/ErrorCodeEnum';
import { findTokenIncludeUser } from '../db/controllers/tokenController';
import ApiError from '../api/errors/ApiError';

// eslint-disable-next-line import/prefer-default-export
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<any> {
  // if (securityName === 'api_key') {
  //   let token;
  //   if (request.query && request.query.access_token) {
  //     token = request.query.access_token;
  //   }
  //
  //   if (token === 'abc123456') {
  //     return Promise.resolve({
  //       id: 1,
  //       name: 'Ironman',
  //     });
  //   }
  //   return Promise.reject(new Error('Forbidden'));
  // }

  if (securityName === 'jwt') {
    const accessToken = request.headers['x-access-token'] || '';
    if (!accessToken) {
      throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_NOT_PROVIDED);
    }

    const decoded = verifyAccessJWT(accessToken);
    if (typeof decoded === 'string') {
      throw new ApiError(ErrorCodeEnum.INNER_ERROR, 'Should not use string in JWT payload.');
    }
    if (scopes.some((scope) => !decoded.scopes.includes(scope))) {
      throw new UnauthorizedError(ErrorCodeEnum.SCOPE_ACCESS_IS_RESTRICTED);
    }
    const tokenFromDB = await findTokenIncludeUser(String(accessToken));
    if (!tokenFromDB) {
      throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_NOT_EXIST);
    }
    request.session.user = tokenFromDB.user;
    return;
  }

  throw new Error(`Unhandled security type: "${securityName}".`);
}
