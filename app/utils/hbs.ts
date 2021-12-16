import { create } from 'express-handlebars';
import moment from 'moment';

const hbs = create({
  defaultLayout: 'layout.hbs',
  extname: '.hbs',
  helpers: {
    isChildOf,
    parseDate,
    getRemainingTime,
    maskBidderName,
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
  var expiredDate: any = new Date(date);
  var dateNow: any = new Date();

  var seconds = Math.floor((expiredDate - dateNow) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);

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
