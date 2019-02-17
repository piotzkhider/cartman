import * as crypto from 'crypto';

export function verify(signature: string, body: string): boolean {
  return signature === calculateSignature(body);
}

function calculateSignature(body: string): string {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  const calculated = crypto
    .createHmac('sha1', secret)
    .update(body, 'utf8')
    .digest('hex');

  return `sha1=${calculated}`;
}
