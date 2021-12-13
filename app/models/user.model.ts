import bcrypt from 'bcrypt';
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
