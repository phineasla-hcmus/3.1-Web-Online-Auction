import { randomBytes } from 'crypto';
import knex from '../config/database';

export interface Otp {
  userId: number;
  token: string;
}

export enum OtpType {
  Verify = 1,
  Recovery = 2,
}

/**
 * Insert token into `otp` table, if `userId` is already existed, overwrite the old token
 * @param userId
 * @returns the token generated, haven't test if knex throws any error though
 */
export async function addOtp(userId: any, otpType: OtpType) {
  // Generate char(6) token (Yes, randomBytes(3) is correct)
  const token = randomBytes(3).toString('hex');
  return knex('otp')
    .insert({
      userId,
      otpType,
      token,
      dateCreated: new Date(),
    })
    .onConflict(['userId', 'otpType'])
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
