import { randomBytes } from 'crypto';
import knex from '../config/database';
import { RoleType } from './role.model';

export interface User {
  userId: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  roleId: number;
}

export function findUserByEmail(email: string) {
  return knex<User>('users').where('email', email).first();
}

export function findUserById(id: string) {
  return knex<User>('users').where('userId', id).first();
}

/**
 * Insert new user to the database
 * @note
 * - `roleId = 1` (Unverified user)
 * - `password` must be hashed
 * @param user
 * @returns userId
 */
export function addUser(user: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
}) {
  return knex('users').insert(user);
}

/**
 * Insert token into `otp` table
 * @param userId
 * @param forceInsert replace token if `userId` is already existed in `otp` table
 * @returns `[0]` if `merge()` or `ignore()` successfully, else use `catch()` to find out
 */
export function addUserOtp(userId: any, forceInsert = false) {
  const token = randomBytes(2).toString('hex');
  const isConflict = knex('otp')
    .insert({
      userId: userId,
      token: token,
      dateCreated: Date.now(),
    })
    .onConflict('userId');
  return forceInsert ? isConflict.merge() : isConflict.ignore();
}
