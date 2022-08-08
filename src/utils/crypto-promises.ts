/** Exporting "crypto" module's functions
 *  in a "promise" format, instead of "callback" type.
 *  Also provides functions based on "crypto" module */

import {
  randomBytes as randomBytesRaw,
  pbkdf2 as pbkdf2Raw,
  BinaryLike,
} from 'crypto';

export const randomBytes = async (size: number): Promise<Buffer> => (
  randomBytesRaw(size)
);

export const pbkdf2 = async (
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
  keylen: number,
  digest: string,
): Promise<Buffer> => (
  new Promise((resolve, reject) => {
    pbkdf2Raw(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      },
    );
  })
);

const PASSWORD_SALT_LENGTH = 16;
const PASSWORD_HASH_ITERATIONS = 310000;
const PASSWORD_HASH_LENGTH = 32;
const PASSWORD_HASH_TYPE = 'sha256';

export async function generatePasswordHash(password: string, passwordSalt: string) {
  return String(await pbkdf2(
    password,
    passwordSalt,
    PASSWORD_HASH_ITERATIONS,
    PASSWORD_HASH_LENGTH,
    PASSWORD_HASH_TYPE,
  ));
}

export async function generatePasswordHashAndSalt(password: string) {
  const passwordSalt = randomBytesRaw(PASSWORD_SALT_LENGTH).toString();
  const passwordHash = await generatePasswordHash(password, passwordSalt);
  return { passwordSalt, passwordHash };
}

export async function isValidPasswordHash(password, salt, hash) {
  const calculatedHash = await generatePasswordHash(password, salt);
  return hash === calculatedHash;
}
