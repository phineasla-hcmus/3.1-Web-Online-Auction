import { randomBytes } from 'crypto';
import knex from '../config/database';
import { RoleType } from './role.model';

export interface User {
  userId: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  address?: string;
  roleId?: number;
}

export enum UserField {
  UserId = 'userId',
  Email = 'email',
  Password = 'password',
  FirstName = 'firstName',
  LastName = 'lastName',
  Dob = 'dob',
  Address = 'address',
  RoleId = 'roleId',
}

export const userQueryHidePassword = [
  UserField.UserId,
  UserField.Email,
  UserField.FirstName,
  UserField.LastName,
  UserField.Dob,
  UserField.Address,
  UserField.RoleId,
];

export const userQueryBasic = [
  UserField.Email,
  UserField.FirstName,
  UserField.LastName,
];

// export function findUserByEmail(email: string): Promise<User>;
export async function findUserByEmail(email: string, columns?: UserField[]) {
  return knex<User>('users').where('email', email).first();
  // return await knex.column(columns).from<User>('users').where('email', email).first();
}

export async function findUserById(id: string) {
  return knex<User>('users').where('userId', id).first();
}

/**
 * Insert new user into `users` table
 * @note
 * - Default `roleId = 1` (Unverified user)
 * - Set `roleId = 2` is if user registered with 3rd party authentication
 * - `password` must be hashed
 * @param user
 * @returns userId
 */
export async function addUser(user: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  roleId?: RoleType.Unverified | RoleType.Bidder;
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
