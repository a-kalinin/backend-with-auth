import { Request } from 'express';
import UnauthorizedError from '../api/errors/UnauthorizedError';
import ErrorCodeEnum from '../@types/ErrorCodeEnum';
import { verifyAccessJWT } from '../services/tokenService';
import { findTokenIncludeUser } from '../db/controllers/tokenController';

export default function authMiddleware(req: Request, res, next) {
  const accessToken = req.headers['x-access-token'] || '';
  if (!accessToken) {
    throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_NOT_PROVIDED);
  }

  verifyAccessJWT(accessToken);
  findTokenIncludeUser(String(accessToken))
    .then((tokenFromDB) => {
      if (!tokenFromDB) {
        throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_NOT_EXIST);
      }
      req.session.user = tokenFromDB.user;

      next();
    })
    .catch(next);
}
