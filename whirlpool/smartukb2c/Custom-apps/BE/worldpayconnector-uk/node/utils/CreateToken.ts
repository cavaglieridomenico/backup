import crypto from 'crypto';

export function CreateToken(): string {
    return crypto.randomBytes(16).toString('hex')
}
