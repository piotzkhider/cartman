import * as crypto from 'crypto';

const secret = process.env.GITHUB_WEBHOOK_SECRET;

export function verify(body: string): boolean {
  return secret === calculateSignature(body);
}

function calculateSignature(body: string): string {
  const calculated = crypto
    .createHmac('sha1', secret)
    .update(body, 'utf8')
    .digest('hex');

  return `sha1=${calculated}`;
}
