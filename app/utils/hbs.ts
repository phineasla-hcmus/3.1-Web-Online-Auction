import { create } from 'express-handlebars';
import moment from 'moment';

const hbs = create({
  defaultLayout: 'layout.hbs',
  extname: '.hbs',
  helpers: {
    isChildOf,
    parseDate,
    parseDob,
    getRemainingTime,
    maskBidderName,
    section,
    isFavorite,
    isBidder,
    isSeller,
    isAdmin,
    isRecentlyUploaded,
    isPendingRequest,
  },
});

export default hbs;

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

function getRemainingTime(date: string) {
  let expiredDate: any = new Date(date);
  let dateNow: any = new Date();

  let seconds = Math.floor((expiredDate - dateNow) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  return days + ' days ' + hours + ' hours ' + minutes + ' minutes ';
}

function maskBidderName(bidderName: string) {
  const lastname = bidderName.substring(4);
  const mask = '*'.repeat(4);
  return mask + lastname;
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

/**
 * [handlebars-section](https://wolfgang-ziegler.com/blog/a-scripts-section-for-your-handlebars-layout-template)
 * @example
 * **layout.hbs**
 * ```
 * <body>
 *    {{{sections.script}}}
 * </body>
 * ```
 *
 * **login.hbs**
 * ```
 * <p>Custom script section</p>
 * {{#section "script"}}
 *    <script src="/public/js/login.js" />
 * {{/section}}
 * ```
 */
function section(this: any, name: string, options: any) {
  if (!this.section) this.section = {};
  this.section[name] = options.fn(this);
  return null;
}
