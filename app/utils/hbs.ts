import { create } from 'express-handlebars';
import moment from 'moment';
import productModel from '../models/product.model';

const hbs = create({
  defaultLayout: 'layout.hbs',
  extname: '.hbs',
  helpers: {
    isChildOf,
    parseDate,
    parseDob,
    parseDatePicker,
    getRemainingTime,
    maskBidderName,
    section,
    isFavorite,
    isBidder,
    isSeller,
    isBidderOrSeller,
    isAdmin,
    isRecentlyUploaded,
    isPendingRequest,
    isFullStar,
    isEmptyStar,
    getRatingType,
    checkFavoriteProduct,
    parseRating,
    isDisableProduct,
    isSellerOfThis,
    isDeniedUser,
    isBuyNowPrice,
    isNotExpired,
  },
});

export default hbs;
function isBuyNowPrice(price: number) {
  return price != null;
}

function isChildOf(parentId: string, catId: string) {
  return parentId === catId;
}

function parseDate(date: string) {
  let d = new Date(date);
  return moment(d).format('DD/MM/YYYY HH:mm:ss');
}

function parseDob(date: string) {
  let d = new Date(date);
  return moment(d).format('DD/MM/YYYY');
}

function parseDatePicker(date: string) {
  let d = new Date(date);
  return moment(d).format('MM/DD/YYYY');
}

function getRemainingTime(date: string) {
  let expiredDate: any = new Date(date);
  let dateNow: any = new Date();
  if (expiredDate <= dateNow) return '0 days';
  let seconds = Math.floor((expiredDate - dateNow) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  let result = '';
  if (days > 0) {
    result += days + ' days';
  }
  if (hours > 0) {
    result += ' ' + hours + ' hours';
  }
  if (minutes > 0) {
    result += ' ' + minutes + ' minutes';
  }
  return result;
}

function maskBidderName(bidderName: string) {
  if (bidderName != undefined && bidderName.length != 0) {
    const lastName = bidderName.substring(4);
    const mask = '*'.repeat(4);
    return mask + lastName;
  }
  return '';
}

function isFavorite(proId: any, listFavorite: any) {
  return listFavorite.some(function (e1: any) {
    return e1.proId === proId;
  });
}

function isBidder(roleId: number) {
  return roleId === 2;
}

function isSeller(roleId: number) {
  return roleId === 3;
}

function isBidderOrSeller(roleId: number) {
  return roleId === 2 || roleId === 3;
}
function isAdmin(roleId: number) {
  return roleId === 4;
}

function isRecentlyUploaded(product: any) {
  let uploadTime: any = new Date(product.postDate);
  let currentTime: any = new Date();
  let seconds = Math.floor((currentTime - uploadTime) / 1000);
  let minutes = Math.floor(seconds / 60);
  if (minutes <= 30) {
    return true;
  }
  return false;
}

function isPendingRequest(status: number) {
  return status === -1;
}

function isFullStar(star: string) {
  return star === 'full';
}

function isEmptyStar(star: string) {
  return star === 'empty';
}

function parseRating(rating: number) {
  return rating ? rating : '';
}

function getRatingType(rating: string, type: string) {
  return rating === type;
}

function isDisableProduct(isDisable: number) {
  return isDisable === 1;
}
function isSellerOfThis(sellerId: number, userId: number) {
  return sellerId === userId;
}

function isDeniedUser(listDenied: any, userId: any) {
  for (let i = 0; i < listDenied.length; i++) {
    if (listDenied[i].bidderId == userId) return true;
  }
  return false;
}

function isNotExpired(ExpiredDate: string) {
  var exDate = new Date(ExpiredDate);
  var curDate = new Date();
  return exDate >= curDate;
}
/**
 * [handlebars-section](https://wolfgang-ziegler.com/blog/a-scripts-section-for-your-handlebars-layout-template)
 * @note
 * Handlebar partials can't use helpers
 * @example
 * **layout.hbs**
 * ```
 * <body>
 *    {{{section.scripts}}}
 * </body>
 * ```
 *
 * **login.hbs**
 * ```
 * <p>Custom script section</p>
 * {{#section "scripts"}}
 *    <script src="/public/js/login.js"></script>
 * {{/section}}
 * ```
 */
function section(this: any, name: string, options: any) {
  if (!this.section) this.section = {};
  this.section[name] = options.fn(this);
  return null;
}

async function checkFavoriteProduct(userId: any, proId: number) {
  const check = await productModel.checkIfLike_or_Unlike(userId.userId, proId);
  return true;
}
