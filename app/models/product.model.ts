import db from "../config/database";
export default {
  async findNearEndProducts() {
    return db("products").orderBy("expiredDate", "asc").limit(5);
  },
  async findMostBidsProducts() {
    return db("products").orderBy("numberOfBids", "desc").limit(5);
  },
  async findHighestPriceProducts() {
    return db("products").orderBy("currentPrice", "desc").limit(5);
  },
  async findProductbyCategory(catid: string | number | Readonly<any> | null){
    return db("products").join("categories AS cat1",{'products.catId':"cat1.catId"}).join("categories AS cat2",{"cat1.parentId":"cat2.catId"}).where("cat2.catId",catid);
  }
};
