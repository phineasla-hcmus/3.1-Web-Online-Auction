import bcrypt from 'bcrypt';
import knex from '../config/database';
import { RoleType } from './role.model';

export interface User {
  userId: number;
  email: string;
  username: string;
  fullname: string;
  dob: Date;
  address: string;
  roleId: number;
}

export function findUserByEmail(email: string) {
  return knex<User>('users').where('email', email).first() || null;
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
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  dob: Date;
  address: string;
}) {
  return knex('users').insert(user);
}
