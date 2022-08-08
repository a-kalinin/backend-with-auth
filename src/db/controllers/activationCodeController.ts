import AppDataSource from '../AppDataSource';
import { ActivationCode } from '../entities/ActivationCode';
import { User } from '../entities/User';
import ErrorCodeEnum from '../../@types/ErrorCodeEnum';
import UnauthorizedError from '../../api/errors/UnauthorizedError';

export async function findActivationCode(code: string) {
  const codeRepository = AppDataSource.getRepository(ActivationCode);
  return codeRepository.findOneBy({ code });
}

export async function findActivationCodeJoinUser(code: string) {
  const codeRepository = AppDataSource.getRepository(ActivationCode);
  return codeRepository.findOne({
    where: { code },
    relations: { user: true },
  });
}

export async function removeActivationCodeRecord(record: ActivationCode) {
  const codeRepository = AppDataSource.getRepository(ActivationCode);
  return codeRepository.remove(record);
}

export async function findLastActivationCodeForUser(user: User) {
  const codeRepository = AppDataSource.getRepository(ActivationCode);
  return codeRepository.findOne({
    where: { user: { id: user.id } },
    order: { createdAt: 'desc' },
  });
}

export async function createAndSaveActivationCode(user: User) {
  const codeRepository = AppDataSource.getRepository(ActivationCode);
  const lastCode = await findLastActivationCodeForUser(user);
  const maxLastAttemptTime = new Date(
    Date.now() - Number(process.env.AUTORIZATION_CODE_REPEAT_DELAY) * 1000,
  );
  if (lastCode && lastCode.createdAt > maxLastAttemptTime) {
    throw new UnauthorizedError(ErrorCodeEnum.ACTIVATION_SEND_TOO_OFTEN);
  }
  const code = codeRepository.create({
    expiresOn: new Date(Date.now() + Number(process.env.AUTORIZATION_CODE_LIFETIME) * 1000),
    createdAt: new Date(),
    user,
  });
  await codeRepository.save(code);
  return code.code;
}
