import { getUserDto, UserT } from '../responseModels/user';
import {
  createAndSaveUser,
  findAndActivateUserByActivationCode,
  findUserByEmail,
  findUserById,
} from '../db/controllers/userController';
import NotFoundError from '../api/errors/NotFoundError';
import { UserCreationParamsT, UserLoginRequestParamsT } from '../@types/requestDTO';
import { EmailT, UUID } from '../@types/string';
import { sendActivationCode } from './mailService';
import { isValidPasswordHash } from '../utils/crypto-promises';
import ApiError from '../api/errors/ApiError';
import ErrorCodeEnum from '../@types/ErrorCodeEnum';
import { createAndSaveTokens } from './tokenService';
import { createAndSaveActivationCode } from '../db/controllers/activationCodeController';

export async function getUserById(
  userId: UUID,
): Promise<UserT> {
  const user = await findUserById(userId);
  if (!user) { throw new NotFoundError('user'); }
  return getUserDto(user);
}

export async function getUserByEmail(
  email: EmailT,
): Promise<UserT> {
  const user = await findUserByEmail(email);
  if (!user) { throw new NotFoundError('user'); }
  return getUserDto(user);
}

export async function activateUserActivationCode(
  code: UUID,
): Promise<UserT> {
  const user = await findAndActivateUserByActivationCode(code);
  if (!user) { throw new NotFoundError('user'); }
  return getUserDto(user);
}

export async function createUser(userParams: UserCreationParamsT): Promise<void> {
  const { email, activationCode } = await createAndSaveUser(userParams);
  await sendActivationCode(email, activationCode);
}

export async function resendActivationCode(email: EmailT): Promise<void> {
  const user = await findUserByEmail(email);
  if (!user) throw new NotFoundError('user');
  const activationCode = await createAndSaveActivationCode(user);
  await sendActivationCode(email, activationCode);
}

export async function loginUser({
  email,
  password,
}: UserLoginRequestParamsT) {
  const user = await findUserByEmail(email);
  if (!user) throw new NotFoundError('user');

  const passwordIsValid = await isValidPasswordHash(password, user.passwordSalt, user.passwordHash);
  if (!passwordIsValid) throw new ApiError(ErrorCodeEnum.WRONG_PASSWORD);

  if (!user.isActivated) {
    throw new ApiError(ErrorCodeEnum.USER_NOT_ACTIVATED);
  }

  const { refreshToken, accessToken } = await createAndSaveTokens(user);

  return {
    response: {
      accessToken,
      user: getUserDto(user),
    },
    refreshToken,
  };
}
