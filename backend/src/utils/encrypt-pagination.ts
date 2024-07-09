import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
const algorithm = 'aes-256-cbc';
const salt = randomBytes(16);

const salt_key = process.env.SALT_KEY || '';

const key = scryptSync(salt_key as string, salt, 32);

export function encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${salt.toString('hex')}:${encrypted}`;
}

export function decrypt(text: string): string {
    const [ivs, salts, data] = text.split(':');
    const iv = Buffer.from(ivs, 'hex');
    const salt = Buffer.from(salts, 'hex');
    const key = scryptSync(salt_key as string, salt, 32);
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}
