import { create } from "express-handlebars";

const hbs = create({
  defaultLayout: "layout.hbs",
  extname: ".hbs",
  helpers: {
    isChildOf,
    parseDate,
    getRemainingTime,
    section,
  },
});

export default hbs;

function isChildOf(parentId: string, catId: string) {
  return parentId === catId;
}

function parseDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function getRemainingTime(date: string) {
  let today = new Date();
  let expiredDate = new Date(date);
  return expiredDate.getDate() - today.getDate();
}

/**
 * [handlebars-section](https://wolfgang-ziegler.com/blog/a-scripts-section-for-your-handlebars-layout-template)
 * @example
 * "layout.hbs"
 * <body>
 *  {{{sections.script}}}
 * </body>
 * 
 * "login.hbs"
 * <p>Custom script section</p>
 * {{#section "script"}}
 *  <script src="public/js/login.js" />
 * {{/section}}
 */
function section(this: any, name: string, options: any) {
  if (!this.sections) this.section = {};
  this.section[name] = options.fn(this);
  return null;
}
