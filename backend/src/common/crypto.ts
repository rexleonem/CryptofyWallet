import crypto from 'crypto';

function requireBase64Key(envName: string, expectedBytes: number) {
  const raw = process.env[envName];
  if (!raw) {
    throw new Error(`${envName} is required`);
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== expectedBytes) {
    throw new Error(`${envName} must be base64 of ${expectedBytes} bytes`);
  }
  return key;
}

export type EncryptedPayload = {
  v: number;
  alg: 'aes-256-gcm';
  iv: string; // base64
  tag: string; // base64
  ct: string; // base64
};

export function encryptWithMasterKey(plaintext: string, version = 1): EncryptedPayload {
  const key = requireBase64Key('VAULT_MASTER_KEY_B64', 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(`v=${version}`, 'utf8'));
  const ct = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: version,
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ct: ct.toString('base64'),
  };
}

export function decryptWithMasterKey(payload: EncryptedPayload): string {
  const key = requireBase64Key('VAULT_MASTER_KEY_B64', 32);
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ct = Buffer.from(payload.ct, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAAD(Buffer.from(`v=${payload.v}`, 'utf8'));
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString('utf8');
}

export function sha256Base64url(input: string): string {
  const h = crypto.createHash('sha256').update(input, 'utf8').digest();
  return h
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function randomTokenBase64url(bytes = 32): string {
  const b = crypto.randomBytes(bytes);
  return b
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

