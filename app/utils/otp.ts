import { randomBytes } from 'crypto';

function makeOtp(length: number) {
  return randomBytes(length).toString();
}
