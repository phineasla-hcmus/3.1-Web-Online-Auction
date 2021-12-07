import bcrypt from 'bcrypt';
import knex from '../config/database';

export interface User {
  id: number;
  email: string;
  username: string;
  address: string;
}

export function findUserByEmail(email: string) {
  return (knex<User>('users').where('email', email).first()) || null;
}

export function addUser(
  email: string,
  username: string,
  hashedPassword: string
) {
  return knex('users').insert({
    email: email,
    username: username,
    password: hashedPassword,
  });
}
