import { randomBytes } from 'crypto';
import knex from '../config/database';

export interface Otp {
  userId: number;
  token: string;
}

/**
 * Insert token into `otp` table, if `userId` is already existed, this will overwrite the old token
 * @param userId
 * @returns the token generated, haven't test if knex throws any error though
 */
export async function addOtp(userId: any) {
  const token = randomBytes(2).toString('hex');
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

/**
 *
 * @param userId
 * @returns a token string if found, else `undefined`
 */
export async function findOtp(userId: any): Promise<string | undefined> {
  return knex('otp')
    .where({ userId })
    .select('token')
    .first()
    .then((v) => v?.token);
}

/**
 *
 * @param userId
 * @returns `1` if delete successfully, else `0`
 */
export async function deleteOtp(userId: any) {
  return knex('otp').where({ userId }).del();
}
