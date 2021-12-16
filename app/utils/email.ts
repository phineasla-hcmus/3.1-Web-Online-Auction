import { promises as fs } from 'fs';
import { compile } from 'handlebars';
import { createTransporter } from '../config/nodemailer';
import { MAIL_SENDER } from '../config/secret';

/**
 *
 * @param to Recepient
 * @param otp Verification code
 * @param from default to `process.env.MAIL_SENDER`
 */
export async function sendVerify(
  to: string,
  otp: string,
  from: string = MAIL_SENDER
) {
  const raw = await fs.readFile('./emails/verify.html', 'utf-8');
  // Can be improved with precompile handlebars template
  const template = compile(raw);
  const html = template({ email: to, otp: otp });
  const transporter = await createTransporter();
  return transporter.sendMail({
    subject: 'Verify your email',
    from,
    to,
    html,
  });
}
