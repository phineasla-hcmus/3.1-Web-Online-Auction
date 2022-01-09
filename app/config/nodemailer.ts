import { google } from 'googleapis';
import { createTransport } from 'nodemailer';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MAIL_REFRESH_TOKEN,
  MAIL_SENDER,
} from './secret';

/**
 * Use [oauthplayground](https://developers.google.com/oauthplayground)
 * to generate MAIL_REFRESH_TOKEN, not sure why the name "playground" though.
 * 
 * @note Refresh token will be expired in 7 days.
 * Details at: [Using OAuth 2.0](https://developers.google.com/identity/protocols/oauth2#expiration).
 * To avoid this, you can [verify you app](https://support.google.com/cloud/answer/7454865?hl=en).
 * 
 * @see [Tutorial #1](https://stackoverflow.com/a/51933602/12405558)
 * @see [Tutorial #2](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a)
 */
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN });

/**
 * @example
 * ```
 * createTransporter().then(async (transporter) => {
 *  await transporter.sendMail({
 *    subject: 'Test',
 *    text: 'I am sending an email from nodemailer!',
 *    to: 'recipient email address here',
 *    from: MAIL_SENDER,
 *  });
 *  console.log('MAIL SENT');
 * });
 * ```
 */
export async function createTransporter() {
  // https://googleapis.dev/nodejs/google-auth-library/5.5.0/classes/OAuth2Client.html#getAccessToken
  // `getAccessToken()` could throw `invalid_grant` --> Refresh token expired
  try {
    const res = await oauth2Client.getAccessToken();
    const accessToken = res.token!;
    return createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAIL_SENDER,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        accessToken,
        refreshToken: MAIL_REFRESH_TOKEN,
      },
    });
  } catch (error) {
    throw new Error(
      'Refresh token expired. Get new token at https://developers.google.com/oauthplayground'
    );
  }
}
