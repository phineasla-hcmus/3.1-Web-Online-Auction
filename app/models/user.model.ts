import knex from "../config/database";

interface User {
  id: number;
  email: string;
  username: string;
  address: string;
}

export async function findUserByEmail(email: string) {
  return (await knex<User>("users").where("email", email).first()) || null;
}
