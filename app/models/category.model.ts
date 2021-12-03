import db from "../config/database";
export default {
  findParentCategory() {
    return db("categories").where("parentId", null);
  },
  async findChildCategory() {
    const sql = `SELECT * FROM categories WHERE parentId >= 1`;
    const raw = await db.raw(sql);
    return raw[0];
  },
};
