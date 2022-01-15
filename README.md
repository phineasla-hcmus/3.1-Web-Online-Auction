# 3.1-Web-Online-Auction
Final project for Express course: Express Auction

## Installation
1. Install all node dependencies with `npm install` or `yarn install`
2. Copy **.env.example** and rename it to **.env**
3. Connect MySQL with following variables: `DB_HOST`, `DB_USER`, `DB_PORT`, `DB_PASSWORD`, `DB_DATABASE`, `DB_POOL_MIN`, `DB_POOL_MAX`
4. Enable reCAPTCHA:
  - Create reCAPTCHA credential at [Google reCAPTCHA 2](https://www.google.com/recaptcha/admin/create)
  - Fill in `RECAPTCHA_SECRET` and `RECAPTCHA_SITE`
5. Connect Google OAuth 2.0 to use email and login with Google
  - Create new project with this tutorial: [Google Project](https://stackoverflow.com/questions/51933601/what-is-the-definitive-way-to-use-gmail-with-oauth-and-nodemailer/51933602#51933602)
  - Fill in `MAIL_SENDER` (the email you use to create your Google project), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `MAIL_REFRESH_TOKEN`
6. Connect Cloudinary (Image hosting CDN)
  - Create an account at [Cloudinary](https://cloudinary.com/users/login)
  - Fill in `CLOUDINARY_URL`
  
