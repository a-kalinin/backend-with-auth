import { UserT } from '../responseModels/user';

export type UserLoginResponseT = {
  accessToken: string,
  user: UserT,
};
