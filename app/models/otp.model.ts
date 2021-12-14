import { randomBytes } from 'crypto';
import knex from '../config/database';

/**
 * Insert token into `otp` table
 * @param userId
 * @param forceInsert replace token if `userId` is already existed in `otp` table
 * @returns `[0]` if `merge()` or `ignore()` successfully, else use `catch()` to find out
 */
export function addOtp(userId: any, forceInsert = false) {
  const token = randomBytes(16).toString('hex');
  const isConflict = knex('otp')
    .insert({
      userId: userId,
      token: token,
      dateCreated: Date.now(),
    })
    .onConflict('userId');
  return forceInsert ? isConflict.merge() : isConflict.ignore();
}

// export function validate
