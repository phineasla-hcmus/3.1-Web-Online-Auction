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

export async function findParentCategoryByKeyword(keyword: string | any) {
  // still looking for match against in knex
  const sql = `select * from categories where match(catName) against('${keyword}')`;
  const raw = await knex.raw(sql);
  return raw[0];
}
