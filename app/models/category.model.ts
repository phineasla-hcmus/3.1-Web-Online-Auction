import knex from '../config/database';

export interface Category {
  catId: number;
  catName: string;
  parentId: number | null;
}

export async function getCategoryList() {
  return knex<Category>('categories').whereNull('parentId');
}

export async function getSubcategoryList() {
  return knex<Category>('categories').whereNotNull('parentId');
}

export async function findCategory(id: any) {
  return knex<Category>('categories').where('catId', id).first();
}
