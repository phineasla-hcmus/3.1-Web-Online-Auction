import { randomBytes } from 'crypto';
import knex from '../config/database';

export enum OtpType {
  Verify = 1,
  Recovery = 2,
}

export async function findOtp(
  userId: any,
  otpType: OtpType
): Promise<{ token: string; dateCreated: Date } | undefined> {
  return knex('otp')
    .where('userId', userId)
    .andWhere('otpType', otpType)
    .select(['token', 'dateCreated'])
    .first();
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
 * @param otpType
 * @returns `1` if delete successfully, else `0`
 */
export async function deleteOtp(userId: any, otpType: OtpType) {
  return knex('otp').where({ userId, otpType }).del();
}
