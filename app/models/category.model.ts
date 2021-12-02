import db from "../utils/db";
export default {
  findParentCategory() {
    return db("categories").where("parentId", null);
  },
  async findChildCategory() {
    const sql = `select * from categories where parentId >= 1`;
    const raw = await db.raw(sql);
    return raw[0];
  },
};
