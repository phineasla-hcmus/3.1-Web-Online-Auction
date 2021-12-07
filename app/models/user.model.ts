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

export function addUser(
  email: string,
  username: string,
  hashedPassword: string,
  roleId = RoleType.Unverified
) {
  return knex('users').insert({
    email: email,
    username: username,
    password: hashedPassword,
    roleId: roleId,
  });
}
