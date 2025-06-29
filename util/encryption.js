const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return `${encrypted}:${iv.toString('hex')}`;
}

function decrypt(encryptedText) {
  if (typeof encryptedText !== 'string') return encryptedText;
  if (!encryptedText.includes(':')) return encryptedText;

  const [encrypted, ivHex] = encryptedText.split(':');
  if (!encrypted || !ivHex) return encryptedText;

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  try {
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.error('Decryption error:', err.message);
    return encryptedText;
  }
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

module.exports = { encrypt, decrypt, hash, normalizeEmail, normalizePhone };
