import { User } from '../db/entities/User';

export type AccessTokenDataT = {
  accessToken: string,
  accessTokenExpiresOn: Date,
};

export type RefreshTokenDataT = {
  refreshToken: string,
  refreshTokenExpiresOn: Date,
};

export type TokenDataT = AccessTokenDataT & RefreshTokenDataT;

/**  Extending session data type */
declare module 'express-session' {
  interface SessionData {
    refreshToken: string;
    user: User,
  }
}
