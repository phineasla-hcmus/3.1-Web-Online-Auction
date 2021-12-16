import { randomBytes } from 'crypto';
import knex from '../config/database';

/**
 * Insert token into `otp` table, if `userId` is already existed, this will overwrite the old token
 * @param userId
 * @returns the token generated
 */
export async function addOtp(userId: any) {
  const token = randomBytes(2).toString('hex');
  console.log('CREATED TOKEN: ' + token);
  return knex('otp')
    .insert({
      userId: userId,
      token: token,
      dateCreated: new Date(),
    })
    .onConflict('userId')
    .merge()
    .then((_) => token);
}

// export function validate
