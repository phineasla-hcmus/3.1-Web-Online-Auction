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

interface EmailProduct {
  id: string;
  name: string;
  price: number;
  thumbnailUrl: string;
}

export async function sendUpdate(to: string | string[], product: EmailProduct) {
  return sendTemplate('./emails/product.html', to, 'New bidding price', {
    title: 'New bidding price',
    body: `The price for your ${product.name} has increased`,
    productId: product.id,
    productName: product.name,
    thumbnailUrl: product.thumbnailUrl,
    productPrice: `\$ ${product.price}`,
    date: new Date().toDateString(),
  });
}

/**
 * Send to Seller that no one buy his/her product
 * @param to
 */
export async function sendSellerNoSale(to: string, product: EmailProduct) {
  return sendTemplate('./emails/product.html', to, 'Auction closed', {
    title: 'Auction closed',
    body: 'Your product has expired, unfortunately, no one has bidded your product',
    productId: product.id,
    productName: product.name,
    thumbnailUrl: product.thumbnailUrl,
    productPrice: `\$${product.price}`,
    date: new Date().toDateString(),
  });
}

export async function sendSellerAuctionEnded(
  to: string,
  product: EmailProduct
) {
  return sendTemplate('./emails/product.html', to, 'Auction closed', {
    title: 'Auction closed',
    body: 'The auction has concluded. Expect your payment to arrive within 72 hours',
    productId: product.id,
    productName: product.name,
    thumbnailUrl: product.thumbnailUrl,
    productPrice: `\$ ${product.price}`,
    date: new Date().toDateString(),
  });
}

export async function sendWinner(to: string, product: EmailProduct) {
  return sendTemplate('./email/product.html', to, 'Auction closed', {
    title: "You've won",
    body: `Congratulations on winning the ${product.name}. Please process to pay and claim your product within 72 hours`,
    productId: product.id,
    productName: product.name,
    thumbnailUrl: product.thumbnailUrl,
    productPrice: `\$ ${product.price}`,
    date: new Date().toDateString(),
    email: to,
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
