import { create } from 'express-handlebars';
import moment from 'moment';
import productModel from '../models/product.model';

const hbs = create({
  defaultLayout: 'layout.hbs',
  extname: '.hbs',
  helpers: {
    isChildOf,
    parseDate,
    getRemainingTime,
    // getCurrentBidder,
    section,
  },
});

export default hbs;

function isChildOf(parentId: string, catId: string) {
  return parentId === catId;
}

function parseDate(date: string) {
  var d = new Date(date);
  return moment(d).format('DD/MM/YYYY HH:mm:ss');
}

function getRemainingTime(date: string) {
  let today = new Date();
  let expiredDate = new Date(date);
  return expiredDate.getDate() - today.getDate();
}

// function getCurrentBidder(proId: number) {
//   // let result = await productModel.getCurrentBidder(proId);
//   // return Promise.resolve(result[0].firstname);
//   const firstname = productModel.getCurrentBidder(proId).then((firstname) => {
//     return Promise.resolve(firstname);
//   });
//   return firstname;
// }

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
