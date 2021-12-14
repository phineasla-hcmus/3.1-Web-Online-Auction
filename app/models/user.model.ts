import knex from '../config/database';
import { RoleType } from './role.model';

export const userQueryBasic = [
  'userId',
  'email',
  'firstName',
  'lastName',
  'roleId',
];

// Enable type hinting in req.user
export type User = Express.User;

/**
 * @default ```SELECT * FROM users WHERE email=?```
 * @param email
 * @param columns specify which columns to SELECT, override default
 * @returns
 */
export async function findUserByEmail(email: string, columns?: string[]) {
  const query =
    columns && columns.length
      ? knex.column(columns).select().from<User>('users')
      : knex<User>('users');
  return query.where('email', email).first();
}

/**
 * @default ```SELECT * FROM users WHERE userId=?```
 * @param userId
 * @param columns specify which columns to SELECT, override default
 * @returns
 */
export async function findUserById(userId: number, columns?: string[]) {
  const query =
    columns && columns.length
      ? knex.column(columns).select().from<User>('users')
      : knex<User>('users');
  return query.where('userId', userId).first();
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
