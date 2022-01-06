import { promises as fs } from 'fs';
import { compile } from 'handlebars';
import { createTransporter } from '../config/nodemailer';
import { MAIL_SENDER } from '../config/secret';

export async function sendVerify(to: string | string[], otp: string) {
  return sendTemplate('./emails/verify.html', to, 'Verify your email', {
    email: to,
    otp,
  });
}

export async function sendRecovery(to: string | string[], otp: string) {
  return sendTemplate('./emails/recovery.html', to, 'Reset your password', {
    email: to,
    otp,
  });
}

async function sendTemplate(
  filepath: string,
  to: string | string[],
  subject: string,
  context: any
) {
  const raw = await fs.readFile(filepath, 'utf-8');
  // Can be improved using precompiled handlebars template
  const template = compile(raw);
  const html = template(context);
  const transporter = await createTransporter();
  return transporter.sendMail({
    subject,
    from: MAIL_SENDER,
    to,
    html,
  });
}
