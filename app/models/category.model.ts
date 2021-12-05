import db from "../config/database";
export default {
  findParentCategory() {
    return db("categories").where("parentId", null);
  },
  async findChildCategory() {
    return db("categories").where("parentId", ">=", 1);
  },
};
