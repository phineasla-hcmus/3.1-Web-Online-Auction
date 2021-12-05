import db from "../config/database";
export default {
  async findNearEndProducts() {
    const sql = `
    SELECT * FROM products
    ORDER BY expiredDate ASC
    LIMIT 3;`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async findMostBidsProducts() {
    const sql = `
    SELECT * FROM products
    ORDER BY numberOfBids DESC
    LIMIT 3;`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async findHighestPriceProducts() {
    const sql = `
    SELECT * FROM products
    ORDER BY currentPrice DESC
    LIMIT 3;`;
    const raw = await db.raw(sql);
    return raw[0];
  },
};
