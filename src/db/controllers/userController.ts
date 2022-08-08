import { generatePasswordHashAndSalt } from '../../utils/crypto-promises';
import { User } from '../entities/User';
import AppDataSource from '../AppDataSource';
import { UserCreationParamsT } from '../../@types/requestDTO';
import EntityExistsError from '../../api/errors/EntityExistsError';
import UnauthorizedError from '../../api/errors/UnauthorizedError';
import ErrorCodeEnum from '../../@types/ErrorCodeEnum';
import { EmailT } from '../../@types/string';
import {
  createAndSaveActivationCode,
  findActivationCodeJoinUser,
  removeActivationCodeRecord,
} from './activationCodeController';

export async function findUserByEmail(email: string) {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ email });
}

export async function findUserById(id: string) {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ id });
}

export async function findAndActivateUserByActivationCode(code: string) {
  const record = await findActivationCodeJoinUser(code);
  if (!record || record.expiresOn < new Date()) {
    throw new UnauthorizedError(ErrorCodeEnum.ACTIVATION_CODE_INVALID);
  }
  await removeActivationCodeRecord(record);

  const { user } = record;
  if (user.isActivated) {
    throw new UnauthorizedError(ErrorCodeEnum.USER_ALREADY_ACTIVATED);
  }
  user.isActivated = true;

  const userRepository = AppDataSource.getRepository(User);
  await userRepository.save(user);
  return user;
}

export async function createAndSaveUser({
  email,
  firstName,
  middleName,
  lastName,
  password,
}: UserCreationParamsT): Promise<{ activationCode: string, email: EmailT }> {
  const candidate = await findUserByEmail(email);
  if (candidate) {
    throw new EntityExistsError('user', 'email', candidate.email);
  }
  const { passwordSalt, passwordHash } = await generatePasswordHashAndSalt(password);
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    email,
    firstName,
    middleName,
    lastName,
    passwordHash,
    passwordSalt,
  });
  const userRecord = await userRepository.save(user);
  const activationCode = await createAndSaveActivationCode(userRecord);
  return { activationCode, email: user.email };
}
