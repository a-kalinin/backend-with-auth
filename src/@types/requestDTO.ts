import { User } from '../db/entities/User';
import { PasswordT } from './string';

export type UserCreationParamsT = Pick<User, 'email'>
  & Pick<Partial<User>, 'firstName' | 'middleName' | 'lastName'>
  & { password: string };

export type UserLoginRequestParamsT = Pick<User, 'email'> & { password: PasswordT };
