import JWT from 'jsonwebtoken';
import {
  findAndRemoveRefreshToken,
  findByRefreshTokenIncludeUser,
  insertToken,
  removeToken,
} from '../db/controllers/tokenController';
import { User } from '../db/entities/User';
import { AccessTokenDataT, RefreshTokenDataT, TokenDataT } from '../@types/common';
import ErrorCodeEnum from '../@types/ErrorCodeEnum';
import ApiError from '../api/errors/ApiError';
import JwtError from '../api/errors/JwtError';
import UnauthorizedError from '../api/errors/UnauthorizedError';

function generateAccessToken(payload): AccessTokenDataT {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('process.env.JWT_ACCESS_SECRET is not set');
  }
  const expiresOn = Math.floor(Date.now() / 1000) + Number(process.env.JWT_ACCESS_EXPIRES_IN);
  return {
    accessToken: JWT.sign({ ...payload, exp: expiresOn }, process.env.JWT_ACCESS_SECRET),
    accessTokenExpiresOn: new Date(expiresOn * 1000),
  };
}

function generateRefreshToken(payload): RefreshTokenDataT {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('process.env.JWT_REFRESH_SECRET is not set');
  }
  const expiresOn = Math.floor(Date.now() / 1000) + Number(process.env.JWT_REFRESH_EXPIRES_IN);
  return {
    refreshToken: JWT.sign({ ...payload, exp: expiresOn }, process.env.JWT_REFRESH_SECRET),
    refreshTokenExpiresOn: new Date(expiresOn * 1000),
  };
}

export function generateTokens(payload): TokenDataT {
  return {
    ...generateAccessToken(payload),
    ...generateRefreshToken(payload),
  };
}

export async function createAndSaveTokens(user: User): Promise<TokenDataT> {
  const tokenData = generateTokens({
    email: user.email,
    scopes: user.scopes,
  });
  await insertToken({ ...tokenData, user });
  return tokenData;
}

export function verifyAccessJWT(token) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new ApiError(ErrorCodeEnum.INNER_ERROR, 'Access secret is not set in environment');
  }
  try {
    return JWT.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err instanceof JWT.TokenExpiredError) {
      throw new JwtError(ErrorCodeEnum.ACCESS_TOKEN_EXPIRED, { ...err }, err.message);
    }
    if (err instanceof JWT.NotBeforeError) {
      throw new JwtError(ErrorCodeEnum.ACCESS_TOKEN_NOT_ACTIVE_YET, { ...err }, err.message);
    }
    if (err instanceof JWT.JsonWebTokenError) {
      throw new JwtError(ErrorCodeEnum.ACCESS_TOKEN_ERROR, { ...err }, err.message);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      ErrorCodeEnum.UNHANDLED_ERROR,
      err instanceof Error ? err.message : undefined,
    );
  }
}

export function verifyRefreshJWT(token) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new ApiError(ErrorCodeEnum.INNER_ERROR, 'Refresh secret is not set in environment');
  }
  try {
    return JWT.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    if (err instanceof JWT.TokenExpiredError) {
      throw new JwtError(ErrorCodeEnum.REFRESH_TOKEN_EXPIRED, { ...err }, err.message);
    }
    if (err instanceof JWT.NotBeforeError) {
      throw new JwtError(ErrorCodeEnum.REFRESH_TOKEN_NOT_ACTIVE_YET, { ...err }, err.message);
    }
    if (err instanceof JWT.JsonWebTokenError) {
      throw new JwtError(ErrorCodeEnum.REFRESH_TOKEN_ERROR, { ...err }, err.message);
    }
    throw new ApiError(
      ErrorCodeEnum.UNHANDLED_ERROR,
      err instanceof Error ? err.message : undefined,
    );
  }
}

export async function removeTokenBySession(session) {
  const { refreshToken } = session;
  await new Promise((resolve, reject) => {
    session.destroy((err) => {
      if (err) {
        reject(new ApiError(
          ErrorCodeEnum.INNER_ERROR,
          'Destroying user session called error',
          err,
        ));
      } else resolve(null);
    });
  });

  if (refreshToken) {
    await findAndRemoveRefreshToken(refreshToken);
  }
}

export async function refreshTokens(accessToken, refreshToken) {
  if (!refreshToken) {
    throw new UnauthorizedError(ErrorCodeEnum.NO_REFRESH_TOKEN_IN_SESSION);
  }
  if (!accessToken) {
    throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_ERROR);
  }

  verifyRefreshJWT(refreshToken);
  const record = await findByRefreshTokenIncludeUser(refreshToken);

  if (!record) {
    throw new UnauthorizedError(ErrorCodeEnum.REFRESH_TOKEN_NOT_EXIST);
  }
  if (record.accessToken !== accessToken) {
    throw new UnauthorizedError(ErrorCodeEnum.ACCESS_TOKEN_NOT_MATCH);
  }
  const newTokens = await createAndSaveTokens(record.user);
  await removeToken(record);

  return newTokens;
}
