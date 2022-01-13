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
  | 'roleId'
  | 'banned';

/** Type hinting for req.user */
export type User = Express.User;

export type Social = {
  userId: string | number;
  socialId: string;
  refreshToken?: string;
  provider: number;
};

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
 * @returns `Express.User` by default, or an object contain selected columns
 */
export async function findUserById(userId: any, columns?: UserColumn[]) {
  const query =
    columns && columns.length
      ? knex.column(columns).select().from<User>('users')
      : knex<User>('users');
  return query.where('userId', userId).first();
}

export async function findSocialById(socialId: string) {
  return knex<Social>('socials').where('socialId', socialId).first();
}

export async function findSocialByUserId(userId: any) {
  return knex<Social>('socials').where('userId', userId).first();
}

/**
 *
 * @param userId
 * @returns email or undefined
 */
export async function findPendingEmailByUserId(userId: any) {
  return knex
    .select('email')
    .from('pendingEmails')
    .where('userId', userId)
    .first()
    .then((value?: { email: string }) => value?.email);
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
  return knex('users')
    .insert(user)
    .then((value) => value[0]);
}

/**
 *
 * @param social
 * @returns [0] if succeed, I don't know why, maybe because MySQL with 2-column primary keys
 */
export async function addSocial(social: Social) {
  return knex('socials').insert(social);
}

/**
 * Insert email into `pendingEmail` table, if `userId` is already existed, overwrite the old email
 * @param userId
 * @param email
 * @returns 🤷
 */
export async function addPendingEmail(userId: any, email: string) {
  return knex('pendingEmails')
    .insert({ userId, email })
    .onConflict('userId')
    .merge();
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

/**
 * Unlink one or multiple 3rd party accounts
 * @param userId
 * @param socialId
 * @returns
 */
export async function deleteSocial(userId: any, socialId?: string) {
  return knex('socials')
    .where('userId', userId)
    .modify((queryBuilder) => {
      if (socialId) queryBuilder.andWhere('socialId', socialId);
    })
    .del();
}

export async function deletePendingEmail(userId: any) {
  return knex('pendingEmails').where('userId', userId).del();
}

export async function findExpiredSeller() {
  return knex('upgradeList')
    .where('status', '=', 1)
    .andWhere('expiredDate', '<', new Date());
}

export async function downgradeSeller(sellerId: number) {
  knex('users')
    .where('userId', sellerId)
    .update({
      roleId: 2,
    })
    .then(function (result) {
      return knex('upgradeList').where('bidderId', '=', sellerId).del();
    });
}
