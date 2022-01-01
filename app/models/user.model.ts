import knex from '../config/database';
import { RoleType } from './role.model';

/** Shortcut to use in `columns` parameter in `findUserByEmail()` and `findUserById()` */
export const USER_BASIC: UserColumn[] = [
  'userId',
  'email',
  'firstName',
  'lastName',
  'roleId',
];

export type UserColumn =
  | 'userId'
  | 'email'
  | 'password'
  | 'firstName'
  | 'lastName'
  | 'dob'
  | 'address'
  | 'rating'
  | 'roleId';

/** Type hinting for req.user */
export type User = Express.User;

/**
 * @default ```SELECT * FROM users WHERE email=?```
 * @param email
 * @param columns specify which columns to SELECT, override default
 * @returns
 */
export async function findUserByEmail(email: string, columns?: UserColumn[]) {
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
export async function findUserById(userId: number, columns?: UserColumn[]) {
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
 * - Password must be hashed
 * @param user
 * @returns `userId`
 */
export async function addUser(
  user: Partial<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    address: string;
    roleId: RoleType.Unverified | RoleType.Bidder;
  }>
) {
  return knex('users').insert(user);
}

/**
 *
 * @param userId
 * @param user one or multiple `users` columns, except `userId`
 * @returns `1` if update successfully, else `0`
 */
export async function updateUser(
  userId: any,
  user: Partial<Omit<User, 'userId'>>
) {
  return knex('users').where({ userId }).update(user);
}

export async function updateUserEmail(userId: any, email: string) {
  return knex('users').where({ userId }).update({
    email: email,
  });
}

export async function updateUserName(
  userId: any,
  firstname: string,
  lastname: string
) {
  return knex('users').where({ userId }).update({
    firstname: firstname,
    lastname: lastname,
  });
}

export async function updateUserPassword(userId: any, password: string) {
  return knex('users').where({ userId }).update({
    password: password,
  });
}
