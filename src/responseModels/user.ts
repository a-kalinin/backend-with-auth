import { User } from '../db/entities/User';

export type UserT = Pick<User,
    'id'
    | 'email'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'isActivated'
    | 'scopes'
  >;


export function getUserDto(user: User): UserT {
  return user && {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    isActivated: user.isActivated,
    scopes: user.scopes,
  };
}
