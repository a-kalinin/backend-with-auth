import AppDataSource from '../AppDataSource';
import { AccessToken } from '../entities/AccessToken';

export async function findTokenIncludeUser(accessToken: string) {
  const tokenRepository = AppDataSource.getRepository(AccessToken);
  return tokenRepository.findOne({
    where: { accessToken },
    relations: { user: true },
  });
}

export async function insertToken({
  accessToken,
  accessTokenExpiresOn,
  refreshToken,
  refreshTokenExpiresOn,
  user,
}): Promise<void> {
  const tokenRepository = AppDataSource.getRepository(AccessToken);
  const candidate = tokenRepository.create({
    accessToken,
    accessTokenExpiresOn,
    refreshToken,
    refreshTokenExpiresOn,
    user,
  });
  await tokenRepository.insert(candidate);
}

export async function findAndRemoveRefreshToken(refreshToken: string) {
  const tokenRepository = AppDataSource.getRepository(AccessToken);
  const token = await tokenRepository.findOneBy({ refreshToken });
  if (token) {
    await tokenRepository.remove(token);
  }
}

export async function findByRefreshTokenIncludeUser(refreshToken: string) {
  const tokenRepository = AppDataSource.getRepository(AccessToken);
  return tokenRepository.findOne({
    where: { refreshToken },
    relations: { user: true },
  });
}

export async function removeToken(token: AccessToken) {
  const tokenRepository = AppDataSource.getRepository(AccessToken);
  return tokenRepository.remove(token);
}
