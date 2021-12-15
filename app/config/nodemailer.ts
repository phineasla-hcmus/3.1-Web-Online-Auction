import { google } from 'googleapis';
import { createTransport } from 'nodemailer';
import logger from '../utils/logger';
import {
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REFRESH_TOKEN,
  MAIL_SENDER,
} from './secret';

// https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
// https://stackoverflow.com/questions/51933601/what-is-the-definitive-way-to-use-gmail-with-oauth-and-nodemailer
// Using oauthplayground to generate ACCESS_TOKEN, not sure why the name "playground" though
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
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
  const accessToken = (await oauth2Client.getAccessToken()).token;
  if (!accessToken) {
    return Promise.reject('Failed to create access token for nodemailer');
  }
  return createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: MAIL_SENDER,
      clientId: MAIL_CLIENT_ID,
      clientSecret: MAIL_CLIENT_SECRET,
      accessToken,
      refreshToken: MAIL_REFRESH_TOKEN,
    },
  });
}
