import crypto from 'crypto';

// eslint-disable-next-line max-len
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'defaultencryptionkeydefaultencryptionkey'; // Must be 32 characters
const IV_LENGTH = 16; // Initialization vector length

export function encryptText(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(encryptedText: string): string {
  const [iv, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
